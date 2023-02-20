import BaseDAO, { FieldsMapping, generateSearchDomain, generateSearchQuery } from "./BaseDAO";
import OdooAPI from "./OdooAPI";
import { Language } from "./SettingsDAO";

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
  email: 'user_id.email',
};

type TranslatorDAOApi = {

  /**
   * Takes a translator object coming from an xml-rpc request and sanitize it
   * @param data 
   * @returns 
   */
  cleanTranslator(data: Translator | undefined): Translator | undefined;

  /**
   * Registers a translation skill on the currently authenticated user
   */
  registerSkills(translatorId: number, skills: number[]): Promise<boolean>;

   /**
    * Returns the Translator object related to the currently
    * authenticated user
    */
  current(): Promise<Translator>;
};

const TranslatorDAO: BaseDAO<Translator> & TranslatorDAOApi = {

  async find(id) {
    return this.cleanTranslator(
      await OdooAPI.execute_kw<Translator>('translation.user', 'get_user_info', [id])
    );
  },

  async list(params) {
    const searchParams = generateSearchQuery<Translator>(params, translatorFieldsMapping);
    const [translatorIds, total] = await Promise.all([
      OdooAPI.execute_kw('translation.user', 'search', searchParams),
      OdooAPI.execute_kw('translation.user', 'search', [...searchParams, true]) as Promise<number>
    ]);

    const rawTranslators = await OdooAPI.execute_kw<Translator[]>('translation.user', 'list_users', [translatorIds]);
    const data = (rawTranslators || []).map(it => this.cleanTranslator(it)).filter(it => it !== undefined) as Translator[];
    return {
      total,
      data,
    };
  },

  async listIds(params) {
    const searchParams = generateSearchDomain(params.search, translatorFieldsMapping);
    const ids = await OdooAPI.execute_kw<number[]>('translation.user', 'search', searchParams);
    if (!ids) {
      console.error('Unable to retrieve ids', params.search);
      return [];
    } else {
      return ids;
    }
  },

  async registerSkills(translatorId, skills) {
    console.log(skills);
    for await (const skillId of skills) {
      // Add skills sequentially to avoid overloading the server with parallel API calls
      await OdooAPI.execute_kw('translation.user', 'add_skill', [translatorId, skillId]);
    }

    return true;
  },

  async current() {
    const data = await OdooAPI.execute_kw<Translator>('translation.user', 'get_my_info', []);
    if (!data) {
      console.error('Unable to find current authenticated user!', JSON.stringify(this.store));
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
      total: OdooAPI.ifNoneElse(data.total, 0),
      year: OdooAPI.ifNoneElse(data.year, 0),
      lastYear: OdooAPI.ifNoneElse(data.lastYear, 0),
      skills: OdooAPI.ifNoneElse(data.skills, [] as TranslationSkill[]),
    };
  }
}

export default TranslatorDAO;