import BaseDAO from "./BaseDAO";
import simulator from "./simulator";

type Status = 'done' | 'to do' | 'in process' | 'to review';
type Priority = 0 | 1 | 2 | 3 | 4;

export type Translation = {
  id: number;
  status: Status;
  priority: Priority;
  title: string;
  source: string;
  target: string;
  translator: string;
  date: Date;
};

const allTranslations: Translation[] = [...Array(100).keys()].map((i) => ({
  id: i,
  status: ['done', 'to do', 'in process', 'to review'][Math.floor(Math.random() * 4)] as any,
  priority: Math.floor(Math.random() * 5) as any,
  title: `letter-${i}.pdf`,
  source: ['french', 'english', 'spanish', 'portugese', 'german', 'italian'][Math.floor(Math.random() * 6)],
  target: ['french', 'english', 'spanish', 'portugese', 'german', 'italian'][Math.floor(Math.random() * 6)],
  translator: `user-${Math.round(Math.random() * 100)}`,
  date: new Date(Date.now() - (Math.round(Math.random() * 50000000000))),
}));


const TranslationDAO: BaseDAO<Translation> = {

  async listIds(params) {
    return simulator.simulateListIds(allTranslations, params, 'id');
  },

  async find(id) {
    return simulator.simulateFind(allTranslations, id, 'id');
  },

  async list(params) {
    return simulator.simulateList(allTranslations, params);
  }
};

export default TranslationDAO;