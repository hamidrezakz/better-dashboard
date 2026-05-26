export const DATA_TABLE_PAGE_SIZES = [10, 20, 50, 100] as const;

export type DataTablePageSize = (typeof DATA_TABLE_PAGE_SIZES)[number];

const dataTablePageSizeSet = new Set<number>(DATA_TABLE_PAGE_SIZES);

export function isDataTablePageSize(value: number): value is DataTablePageSize {
  return dataTablePageSizeSet.has(value);
}

export type ParseDataTablePageSizeOptions = {
  defaultPageSize: number;
  allowedSizes?: readonly number[];
};
