
type SearchDomain<T> = { column: keyof T, term: string, operator?: string };

export interface FilterParams<T> {
  search: SearchDomain<T>[];
}

export interface ListQueryParams<T> extends FilterParams<T> {
  sortBy: string[];
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
 * @param fieldsMapping 
 * @returns 
 */
export function generateSortString<T>(sortBy: string[], fieldsMapping: FieldsMapping<T>) {
  let result: string[] = [];
  sortBy.forEach(sortField => {
    const [fieldName, sortOrder = "asc"] = sortField.split(' ');
    if (fieldName in fieldsMapping) {
      const key: keyof T = fieldName as keyof T;
      const sortField = fieldMappingItems(key, fieldsMapping)[0];
      result.push(`${sortField} ${sortOrder}`);
    }
  });
  return result.join(",");
};

export function fieldSearchDomain<T>(item: SearchDomain<T>, fieldsMapping: FieldsMapping<T>) {
  if (!(item.column in fieldsMapping)) {
    console.error(`Unknown field ${item.column as string}, you must define it in the fields mapping table to search it`);
    return undefined;
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
    const op = Object.keys(operators).find(op => item.operator === op) || 'ilike';

    // Remove operator from actual term search
    const term = item.term.replace(op, '').trim();
    return [field, op, formatter(term)];
  }
}

/**
 * Generates a search domain for a given set of search terms and columns
 * @param domain 
 * @param fieldsMapping 
 * @returns 
 */
export function generateSearchDomain<T>(domain: SearchDomain<T>[], fieldsMapping: FieldsMapping<T>) {
  const result = [];
  for (const item of domain) {
    const search = fieldSearchDomain(item, fieldsMapping);
    if (search) {
      result.push(search);
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
    params.sortBy ? generateSortString<T>(params.sortBy, fieldsMapping) : undefined,
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