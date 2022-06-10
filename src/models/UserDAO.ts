import BaseDAO from "./BaseDAO";
import { simulateFind, simulateList } from "./simulator";

type TranslationSkill = {
  source: string;
  target: string;
};

export type User = {
  username: string;
  age: number;
  languages: string[];
  total: number;
  year: number;
  lastYear: number;
  available: boolean;
  skills: TranslationSkill[];
};

const allUsers: User[] = [...Array(100).keys()].map(i => ({
  username: `user-${i}`,
  age: Math.round(Math.random() * 20 + 20),
  languages: ['french', 'english', 'spanish', 'chinese', 'german'].filter(() => Math.random() > 0.5),
  total: Math.round(Math.random() * 100 + 100),
  year: Math.round(Math.random() * 10 + 5),
  lastYear: Math.round(Math.random() * 100 + 50),
  available: Math.random() > 0.3,
  skills: [],
}));

const UserDAO: BaseDAO<User> = {

  async find(id) {
    return simulateFind(allUsers, id, 'username');
  },

  async list(params) {
    return simulateList(allUsers, params);
  }
}

export default UserDAO;