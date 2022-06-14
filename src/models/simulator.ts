import { FilterParams, ListQueryParams, ListResponse } from "./BaseDAO";

function filterItems<T>(allItems: T[], params?: FilterParams<T>['search']): T[] {
  const searchParams = params || [];
  const filtered = allItems.filter((it) => {
    let match = true;
    for (let i = 0; i < searchParams.length; i++) {
      const { term, column } = searchParams[i];
      if (term.trim() !== '') {
        if (!`${it[column]}`.includes(term)) {
          match = false;
        }
      }
    }
    return match;
  });

  return filtered;
}

export function simulateFind<T>(allItems: T[], id: string | number, key: keyof T): Promise<T | undefined> {
  return new Promise(resolve => setTimeout(() => {
    const item = allItems.find(it => `${it[key]}` === `${id}`);
    resolve(item);
  }, Math.random() * 300 + 300));
};

export function simulateListIds<T, K extends keyof T>(allItems: T[], params: FilterParams<T>, idCol: K): Promise<Array<T[K]>> {
  return new Promise(resolve => setTimeout(() => {
    resolve(filterItems(allItems, params.search).map(it => it[idCol]));
  }, Math.random() * 500 + 500));
};

export function simulateList<T>(allItems: T[], params: Partial<ListQueryParams<T>>): Promise<ListResponse<T>> {

  const filtered = filterItems(allItems, params.search);

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

export default {
  simulateFind,
  simulateList,
  simulateListIds,
};