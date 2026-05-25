import {
  DASHBOARD_TABLE_PAGE_SIZES,
  type ParseDashboardTablePageSizeOptions,
} from "@/lib/dashboard-table-page-size";

export type DashboardTableSearchParamsInput = {
  page?: number;
  pageSize?: number;
  filter?: string;
};

export type BuildDashboardTableSearchParamsOptions = {
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

export function parseDashboardTablePage(
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

export function parseDashboardTablePageSize(
  searchParams: Record<string, string | string[] | undefined>,
  options: ParseDashboardTablePageSizeOptions,
): number {
  const allowedSizes = options.allowedSizes ?? DASHBOARD_TABLE_PAGE_SIZES;
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

export function parseDashboardTableFilter(
  searchParams: Record<string, string | string[] | undefined>,
): string | undefined {
  const raw = firstSearchParamValue(searchParams.filter)?.trim();
  return raw || undefined;
}

export function clampDashboardTablePage(
  page: number,
  totalCount: number,
  pageSize: number,
): number {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  return Math.min(Math.max(1, page), totalPages);
}

export function buildDashboardTableSearchParams(
  input: DashboardTableSearchParamsInput,
  options: BuildDashboardTableSearchParamsOptions = {},
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

  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}

export function dashboardTablePath(
  pathname: string,
  input: DashboardTableSearchParamsInput = {},
  options: BuildDashboardTableSearchParamsOptions = {},
): string {
  return `${pathname}${buildDashboardTableSearchParams(input, options)}`;
}
