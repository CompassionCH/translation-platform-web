import BaseDAO from "./BaseDAO";
import simulator from "./simulator";

type TranslationSkill = {
  source: string;
  target: string;
};

export type User = {
  // AuthData
  // Set only on the currently authenticated user
  userId?: string;
  password?: string;

  // Common data, retrieved from odoo
  username: string;
  role: 'user' | 'admin';
  name: string;
  age: number;
  language: string;
  total: number;
  year: number;
  lastYear: number;
  available: boolean;
  skills: TranslationSkill[];
};

const randomLang = () => ['french', 'english', 'spanish', 'chinese', 'german'][Math.floor(Math.random() * 5)];

export const allUsers: User[] = [...Array(100).keys()].map(i => ({
  username: `user-${i}`,
  role: Math.random() > 0.8 ? 'admin' : 'user',
  name: `Mister User ${i}`,
  age: Math.round(Math.random() * 20 + 20),
  language: randomLang(),
  total: Math.round(Math.random() * 100 + 100),
  year: Math.round(Math.random() * 10 + 5),
  lastYear: Math.round(Math.random() * 100 + 50),
  available: Math.random() > 0.3,
  skills: [...Array(Math.round(Math.random() * 3)).keys()].map(() => ({
    source: randomLang(),
    target: randomLang(),
  })),
}));

const UserDAO: BaseDAO<User> = {

  async find(id) {
    return simulator.simulateFind(allUsers, id, 'username');
  },

  async list(params) {
    return simulator.simulateList(allUsers, params);
  },

  async listIds(params) {
    return simulator.simulateListIds(allUsers, params, 'username');
  }
}

export default UserDAO;