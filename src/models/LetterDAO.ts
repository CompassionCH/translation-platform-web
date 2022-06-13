import BaseDAO from "./BaseDAO";
import { simulateFind, simulateList } from "./simulator";

type Status = 'done' | 'to do' | 'in process' | 'to review';
type Priority = 0 | 1 | 2 | 3 | 4;

export type Letter = {
  id: number;
  status: Status;
  priority: Priority;
  title: string;
  source: string;
  target: string;
  translator: string;
  date: Date;
};

const allLetters: Letter[] = [...Array(100).keys()].map((i) => ({
  id: i,
  status: ['done', 'to do', 'in process', 'to review'][Math.floor(Math.random() * 4)] as any,
  priority: Math.floor(Math.random() * 5) as any,
  title: `letter-${i}.pdf`,
  source: ['french', 'english', 'spanish', 'portugese', 'german', 'italian'][Math.floor(Math.random() * 6)],
  target: ['french', 'english', 'spanish', 'portugese', 'german', 'italian'][Math.floor(Math.random() * 6)],
  translator: `user-${Math.round(Math.random() * 100)}`,
  date: new Date(Date.now() - (Math.round(Math.random() * 50000000000))),
}));


const LetterDAO: BaseDAO<Letter> = {

  async find(id) {
    return simulateFind(allLetters, id, 'id');
  },

  async list(params) {
    return simulateList(allLetters, params);
  }
};

export default LetterDAO;