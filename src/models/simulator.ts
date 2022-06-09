import { ListQueryParams, ListResponse } from "./BaseDAO";

export function simulateList<T>(allItems: T[], params: Partial<ListQueryParams<T>>): Promise<ListResponse<T>> {

  const searchParams = params.search || [];
  const filtered = allItems.filter((it) => {
    let match = true;
    for (const { term, column } of searchParams) {
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
    const sortBy = params.sortBy;
    if (!sortBy) return 1;
    if (params.sortOrder === 'asc') {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    } else {
      return a[sortBy] < b[sortBy] ? 1 : -1;
    }
  });

  // Then slice
  const pageNumber = params.pageNumber || 0;
  const pageSize = params.pageSize || 10;
  const response = {
    data: sorted.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize),
    total: sorted.length,
  };

  return new Promise(resolve => setTimeout(() => resolve(response), Math.random() * 300 + 300));
}