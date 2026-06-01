import {
  DATA_TABLE_PAGE_SIZES,
  type ParseDataTablePageSizeOptions,
} from "@/lib/data-table/page-size";

export type DataTableSearchParamsInput = {
  page?: number;
  pageSize?: number;
  filter?: string;
  q?: string;
};

export type BuildDataTableSearchParamsOptions = {
  defaultPageSize?: number;
};

function firstSearchParamValue(
  value: string | string[] | undefined,
): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  return Array.isArray(value) ? value[0] : value;
}

export function parseDataTablePage(
  searchParams: Record<string, string | string[] | undefined>,
  defaultPage = 1,
): number {
  const raw = firstSearchParamValue(searchParams.page);
  if (!raw) {
    return defaultPage;
  }

  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return defaultPage;
  }

  return parsed;
}

export function parseDataTablePageSize(
  searchParams: Record<string, string | string[] | undefined>,
  options: ParseDataTablePageSizeOptions,
): number {
  const allowedSizes = options.allowedSizes ?? DATA_TABLE_PAGE_SIZES;
  const allowedSet = new Set(allowedSizes);
  const raw = firstSearchParamValue(searchParams.pageSize);

  if (!raw) {
    return options.defaultPageSize;
  }

  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || !allowedSet.has(parsed)) {
    return options.defaultPageSize;
  }

  return parsed;
}

export function parseDataTableFilter(
  searchParams: Record<string, string | string[] | undefined>,
): string | undefined {
  const raw = firstSearchParamValue(searchParams.filter)?.trim();
  return raw || undefined;
}

export function parseDataTableQuery(
  searchParams: Record<string, string | string[] | undefined>,
): string | undefined {
  const raw = firstSearchParamValue(searchParams.q)?.trim();
  return raw || undefined;
}

export function clampDataTablePage(
  page: number,
  totalCount: number,
  pageSize: number,
): number {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  return Math.min(Math.max(1, page), totalPages);
}

export function buildDataTableSearchParams(
  input: DataTableSearchParamsInput,
  options: BuildDataTableSearchParamsOptions = {},
): string {
  const params = new URLSearchParams();

  if (input.page !== undefined && input.page > 1) {
    params.set("page", String(input.page));
  }

  const defaultPageSize = options.defaultPageSize;
  if (
    input.pageSize !== undefined &&
    (defaultPageSize === undefined || input.pageSize !== defaultPageSize)
  ) {
    params.set("pageSize", String(input.pageSize));
  }

  const filter = input.filter?.trim();
  if (filter) {
    params.set("filter", filter);
  }

  const q = input.q?.trim();
  if (q) {
    params.set("q", q);
  }

  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}

export function dataTablePath(
  pathname: string,
  input: DataTableSearchParamsInput = {},
  options: BuildDataTableSearchParamsOptions = {},
): string {
  return `${pathname}${buildDataTableSearchParams(input, options)}`;
}
