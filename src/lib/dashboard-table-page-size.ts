export const DASHBOARD_TABLE_PAGE_SIZES = [10, 20, 50, 100] as const;

export type DashboardTablePageSize =
  (typeof DASHBOARD_TABLE_PAGE_SIZES)[number];

const dashboardTablePageSizeSet = new Set<number>(DASHBOARD_TABLE_PAGE_SIZES);

export function isDashboardTablePageSize(
  value: number,
): value is DashboardTablePageSize {
  return dashboardTablePageSizeSet.has(value);
}

export type ParseDashboardTablePageSizeOptions = {
  defaultPageSize: number;
  allowedSizes?: readonly number[];
};
