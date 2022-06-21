
export interface FilterParams<T> {
  search: Array<{ column: keyof T, term: string }>;
}

export interface ListQueryParams<T> extends FilterParams<T> {
  sortBy?: keyof T;
  sortOrder: 'asc' | 'desc';
  pageSize: number;
  pageNumber: number;
};

export type ListResponse<T> = {
  total: number;
  data: T[];
}

/**
 * The BaseDAO offers a basic interface to implement a DAOTable
 */
interface BaseDAO<T> {
  find(id: number | string): Promise<T | undefined>;
  listIds(params: FilterParams<T>): Promise<Array<string | number>>;
  list(params: Partial<ListQueryParams<T>>): Promise<ListResponse<T>>;
  [key: string]: any;
}

export default BaseDAO;