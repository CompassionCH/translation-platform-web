type Status = 'done' | 'to do' | 'in process' | 'to review';
type Priority = 0 | 1 | 2 | 3 | 4;

type Letter = {
  id: number;
  status: Status;
  priority: Priority;
  title: string;
  source: string;
  target: string;
  translator: string;
  date: Date;
};

type FindParams = {
  orderBy: keyof Letter;
  sortOrder: 'asc' | 'desc';
  itemsPerPage: number;
  page: number;
  search: Array<{ column: keyof Letter, term: string }>;
};

type FindLettersResponse = {
  data: Letter[];
  total: number;
}

const defaultFindParams: FindParams = {
  orderBy: 'priority',
  sortOrder: 'desc',
  search: [],
  itemsPerPage: 10,
  page: 1,
};

const allLetters: Letter[] = [...Array(100).keys()].map((i) => ({
  id: i,
  status: ['done', 'to do', 'in process', 'to review'][Math.floor(Math.random() * 4)] as any,
  priority: Math.floor(Math.random() * 5) as any,
  title: `letter-${i}.pdf`,
  source: ['french', 'english', 'spanish', 'portugese', 'german', 'italian'][Math.floor(Math.random() * 6)],
  target: ['french', 'english', 'spanish', 'portugese', 'german', 'italian'][Math.floor(Math.random() * 6)],
  translator: `user-${Math.round(Math.random() * 100)}`,
  date: new Date(Date.now() - (Math.round(Math.random() * 10000000))),
}));


class LetterDAO {

  async find(searchParams: Partial<FindParams>): Promise<FindLettersResponse> {
    const params = {...defaultFindParams, ...searchParams};
    // First filter by columns
    const filtered = allLetters.filter((it) => {
      let match = true;
      for (const { term, column } of params.search) {
        if (term.trim() !== '') {
          if (!`${it[column]}`.includes(term)) {
            match = false;
          }
        }
      }
      return match;
    });

    // Then apply sort
    const sorted = filtered.sort((a, b) => {
      if (params.sortOrder === 'asc') {
        return a[params.orderBy] > b[params.orderBy] ? 1 : -1;
      } else {
        return a[params.orderBy] < b[params.orderBy] ? 1 : -1;
      }
    });

    // Then slice
    return {
      data: sorted.slice(params.page * params.itemsPerPage, (params.page + 1) * params.itemsPerPage),
      total: allLetters.length,
    };
  }
};

export default LetterDAO;