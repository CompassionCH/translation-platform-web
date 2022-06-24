import notyf from "../notifications";
import BaseDAO, { FieldsMapping, generateSearchDomain, generateSearchQuery, generateSortString } from "./BaseDAO";
import OdooAPI from "./OdooAPI";
import { Language, randomLanguage } from "./SettingsDAO";
import simulator from "./simulator";

export type TranslationSkill = {
  source: Language;
  target: Language;
  verified: boolean;
};

export type Translator = {
  translatorId: number;
  email?: string;
  role: 'user' | 'admin';
  name?: string;
  age?: number;
  language?: Language;
  total?: number;
  year?: number;
  lastYear?: number;
  skills: TranslationSkill[];
};

/**
 * Define the set of available fields in the Translator Model which can be sorted
 * and searched
 */
export const translatorFieldsMapping: FieldsMapping<Translator> = {
  total: { field: 'nb_translated_letters', format: 'number' },
  year: { field: 'nb_translated_letters_this_year', format: 'number' },
  lastYear: { field: 'nb_translated_letters_last_year', format: 'number' },
  age: { field: 'partner_id.age', format: 'number'},
  name: 'partner_id.name',
  language: 'partner_id.lang',
  email: 'user_id.email',
};

export const allTranslators: Translator[] = [...Array(100).keys()].map(i => ({
  translatorId: i,
  email: `email${i}@random.org`,
  role: Math.random() > 0 ? 'admin' : 'user',
  name: `Mister User ${i}`,
  age: Math.round(Math.random() * 20 + 20),
  language: randomLanguage(),
  total: Math.round(Math.random() * 100 + 100),
  year: Math.round(Math.random() * 10 + 5),
  lastYear: Math.round(Math.random() * 100 + 50),
  available: Math.random() > 0.3,
  skills: [...Array(Math.round(1)).keys()].map(() => ({
    source: randomLanguage(),
    target: randomLanguage(),
    verified: true, //Math.random() > 0.5,
  })),
}));

type TranslatorDAOApi = {

  /**
   * Takes a translator object coming from an xml-rpc request and sanitize it
   * @param data 
   * @returns 
   */
  cleanTranslator(data: Translator | undefined): Translator | undefined;

  /**
   * Registers a potential skill in a user
   * @param translatorId
   * @param skills
   */
  registerSkills(translatorId: number, skills: TranslationSkill[]): Promise<boolean>;

   /**
    * Returns the Translator object related to the currently
    * authenticated user
    */
  current(): Promise<Translator>;
};

const TranslatorDAO: BaseDAO<Translator> & TranslatorDAOApi = {

  async find(id) {
    return simulator.simulateFind(allTranslators, id, 'translatorId');
    return this.cleanTranslator(
      await OdooAPI.execute_kw<Translator>('translation.user', 'get_user_info', [id])
    );
  },

  async list(params) {
    const searchParams = generateSearchQuery<Translator>(params, translatorFieldsMapping);
    console.log(searchParams);
    // return simulator.simulateList(allTranslators, params);
    const [translatorIds, total] = await Promise.all([
      OdooAPI.execute_kw('translation.user', 'search', searchParams),
      OdooAPI.execute_kw('translation.user', 'search', [searchParams, true])
    ]);

    const translators = await OdooAPI.execute_kw<Translator[]>('translation.user', 'get_user_info', translatorIds);
    return {
      total,
      data: translators ? translators.map(it => this.cleanTranslator(it)).filter(it => it !== undefined) : [],
    };
  },

  async listIds(params) {
    OdooAPI.execute_kw('translation.user', 'search', [
      // domain
      [],

      // offset
      params.search
    ]);

    return simulator.simulateListIds(allTranslators, params, 'translatorId');
  },

  async registerSkills(translatorId, skills) {
    const user = allTranslators.find(it => it.translatorId === translatorId);
    if (!user) return false;

    return new Promise((resolve) => setTimeout(() => {
      for (const skill of skills) {
        user.skills.push({
          ...skill,
          verified: false,
        });
      }
      resolve(true);
    }, 700));
  },

  async current() {
    return allTranslators[0];
    const data = await OdooAPI.execute_kw<Translator>('translation.user', 'get_my_info', []);
    if (!data) {
      console.error('Unable to find current authenticated user!', JSON.stringify(this.store));
      notyf.error('A critical error occured, please contact Compassion.');
      throw new Error('A Critical error occured');
    }
    
    return this.cleanTranslator(data) as Translator;
  },

  cleanTranslator(data: Translator | undefined): Translator | undefined {
    if (!data) return undefined;
    return {
      ...data,
      email: OdooAPI.ifNoneElse(data.email),
      name: OdooAPI.ifNoneElse(data.name),
      age: OdooAPI.ifNoneElse(data.age),
      language: OdooAPI.ifNoneElse(data.language),
      total: OdooAPI.ifNoneElse(data.total),
      lastYear: OdooAPI.ifNoneElse(data.lastYear),
      skills: OdooAPI.ifNoneElse(data.skills, [] as TranslationSkill[]),
    };
  }
}

export default TranslatorDAO;