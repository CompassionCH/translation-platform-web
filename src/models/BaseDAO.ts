
export type ListQueryParams<T> = {
  sortBy?: keyof T;
  sortOrder: 'asc' | 'desc';
  pageSize: number;
  pageNumber: number;
  search: Array<{ column: keyof T, term: string }>;
};

export type ListResponse<T> = {
  total: number;
  data: T[];
}

interface BaseDAO<T> {
  list(params: Partial<ListQueryParams<T>>): Promise<ListResponse<T>>;
}

export default BaseDAO;