import BaseDAO from "./BaseDAO";
import { simulateList } from "./simulator";

export type User = {
  username: string;
  age: number;
  languages: string[];
  total: number;
  year: number;
  lastYear: number;
  available: boolean;
};

const allUsers: User[] = [...Array(100).keys()].map(i => ({
  username: `user-${i}`,
  age: Math.round(Math.random() * 20 + 20),
  languages: ['french', 'english', 'spanish', 'chinese', 'german'].filter(() => Math.random() > 0.5),
  total: Math.round(Math.random() * 100 + 100),
  year: Math.round(Math.random() * 10 + 5),
  lastYear: Math.round(Math.random() * 100 + 50),
  available: Math.random() > 0.3,
}));

const UserDAO: BaseDAO<User> = {

  async list(params) {
    return simulateList(allUsers, params);
  }
}

export default UserDAO;