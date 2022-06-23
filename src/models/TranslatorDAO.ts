import BaseDAO from "./BaseDAO";
import { Language, randomLanguage } from "./SettingsDAO";
import simulator from "./simulator";

export type TranslationSkill = {
  source: Language;
  target: Language;
  verified: boolean;
};

export type Translator = {
  translatorId: number;
  email: string;
  role: 'user' | 'admin';
  name: string;
  age: number;
  language: Language;
  total: number;
  year: number;
  lastYear: number;
  skills: TranslationSkill[];
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
   * Registers a potential skill in a user
   * @param username
   * @param skills
   */
  registerSkills(translatorId: number, skills: TranslationSkill[]): Promise<boolean>;

   /**
    * Returns the Translator object related to the currently
    * authenticated user
    */
  current(): Promise<Translator>;
};

const UserDAO: BaseDAO<Translator> & TranslatorDAOApi = {

  async find(id) {
    return simulator.simulateFind(allTranslators, id, 'translatorId');
  },

  async list(params) {
    return simulator.simulateList(allTranslators, params);
  },

  async listIds(params) {
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
  }
}

export default UserDAO;