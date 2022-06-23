import store from "../store";
import BaseDAO from "./BaseDAO";
import { Language, randomLanguage } from "./SettingsDAO";
import simulator from "./simulator";

export type TranslationSkill = {
  source: Language;
  target: Language;
  verified: boolean;
};

export type User = {
  username: string;
  email: string;
  role: 'user' | 'admin';
  name: string;
  age: number;
  language: Language;
  total: number;
  year: number;
  lastYear: number;
  available: boolean;
  skills: TranslationSkill[];
};

export const allUsers: User[] = [...Array(100).keys()].map(i => ({
  username: i === 0 ? 'toto' : `user-${i}`,
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

type UserDAOApi = {

  /**
   * Registers a potential skill in a user
   * @param username
   * @param skills
   */
   registerSkills(username: string, skills: TranslationSkill[]): Promise<boolean>;
};

const UserDAO: BaseDAO<User> & UserDAOApi = {

  async find(id) {
    return simulator.simulateFind(allUsers, id, 'username');
  },

  async list(params) {
    return simulator.simulateList(allUsers, params);
  },

  async listIds(params) {
    return simulator.simulateListIds(allUsers, params, 'username');
  },

  async registerSkills(username, skills) {
    const user = allUsers.find(it => it.username === username);
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
  }
}

export default UserDAO;