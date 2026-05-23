export type DashboardTableSearchParamsInput = {
  page?: number;
  filter?: string;
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
): string {
  const params = new URLSearchParams();

  if (input.page !== undefined && input.page > 1) {
    params.set("page", String(input.page));
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
): string {
  return `${pathname}${buildDashboardTableSearchParams(input)}`;
}
