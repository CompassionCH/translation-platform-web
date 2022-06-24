
type SearchDomain<T> = { column: keyof T, term: string };

export interface FilterParams<T> {
  search: SearchDomain<T>[];
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

const customFormatters = {
  number: (v: any) => parseInt(v, 10),
  boolean: (v: any) => v === 'true',
  float: (v: any) => parseFloat(v),
};

type CompleteMapping = {
  field: string,
  format?: ((v: any) => any) | keyof typeof customFormatters,
};

export type FieldsMapping<T> = Partial<Record<keyof T, string | CompleteMapping>>;

function fieldMappingItems<T>(column: keyof T, mapping: FieldsMapping<T>): [string, (v: any) => any] {
  const baseFormatter = (v: any) => v;

  if (typeof mapping[column] === 'string') {
    return [mapping[column] as string, baseFormatter];
  } else {
    const item = mapping[column] as CompleteMapping;
    let formatter = baseFormatter;
    if (typeof item.format === 'function') {
      formatter = item.format;
    } else if ((item.format as string) in customFormatters) {
      formatter = customFormatters[item.format as keyof typeof customFormatters];
    }
    return [
      item.field,
      formatter,
    ];
  }
}

/**
 * Generates a search string for the given sort elements
 * @param sortBy 
 * @param sortOrder 
 * @param fieldsMapping 
 * @returns 
 */
export function generateSortString<T>(sortBy: keyof T, sortOrder: 'asc' | 'desc', fieldsMapping: FieldsMapping<T>) {
  if (sortBy in fieldsMapping) {
    const [field] = fieldMappingItems(sortBy, fieldsMapping);
    return `${field} ${sortOrder}`;
  } else {
    console.error(`Unknown field ${sortBy as string}, you must define it in the fields mapping table`);
    return null;
  }
};

/**
 * Generates a search domain for a given set of search terms and columns
 * @param domain 
 * @param fieldsMapping 
 * @returns 
 */
export function generateSearchDomain<T>(domain: SearchDomain<T>[], fieldsMapping: FieldsMapping<T>) {
  const result = [];
  for (const item of domain) {
    if (!(item.column in fieldsMapping)) {
      console.error(`Unknown field ${item.column as string}, you must define it in the fields mapping table to search it`);
    } else {
      // Defines a list of supported operators the user can add in the beginning of the search term
      const operators = {
        '!=': '!=',
        '>=': '>=',
        '<=': '<=',
        '=': '=',
        '<': '<',
        '>': '>',
        '%': 'ilike',
      };

      // Using find, will match first operator, so start with 2chars operators
      const [field, formatter] = fieldMappingItems(item.column, fieldsMapping);
      const op = Object.keys(operators).find(op => item.term.startsWith(op)) || '=';

      // Remove operator from actual term search
      const term = item.term.replace(op, '').trim();
      result.push([field, op, formatter(term)]);
    }
  }

  return result;
};

/**
 * Builds a search query object
 * @param params 
 * @param fieldsMapping 
 * @returns 
 */
export function generateSearchQuery<T>(params: Partial<ListQueryParams<T>>, fieldsMapping: FieldsMapping<T>) {
  const page = params.pageNumber || 0;
  const amount = params.pageSize || 10;
  return [
    generateSearchDomain<T>(params.search || [], fieldsMapping),
    page * amount,
    amount,
    params.sortBy && params.sortOrder ? generateSortString<T>(params.sortBy, params.sortOrder, fieldsMapping) : null,
  ];
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