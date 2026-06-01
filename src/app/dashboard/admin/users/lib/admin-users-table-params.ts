import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import {
  dataTablePath,
  type DataTableSearchParamsInput,
} from "@/lib/data-table/search-params";

export const ADMIN_USERS_DEFAULT_PAGE_SIZE = 20;

export type AdminUserTableFilter = "all" | "admins" | "users" | "banned";

const adminUserTableFilters = new Set<AdminUserTableFilter>([
  "all",
  "admins",
  "users",
  "banned",
]);

export function parseAdminUserTableFilter(
  value: string | undefined,
): AdminUserTableFilter {
  if (value && adminUserTableFilters.has(value as AdminUserTableFilter)) {
    return value as AdminUserTableFilter;
  }
  return "all";
}

export const adminUserFilterLabels: Record<AdminUserTableFilter, string> = {
  all: "All",
  admins: "Admins",
  users: "Users",
  banned: "Banned",
};

export function adminUsersTablePath(
  input: DataTableSearchParamsInput & {
    filter?: AdminUserTableFilter;
  } = {},
): string {
  const filter =
    input.filter && input.filter !== "all" ? input.filter : undefined;

  return dataTablePath(
    dashboardRoutes.adminUsers(),
    {
      page: input.page,
      pageSize: input.pageSize,
      filter,
      q: input.q,
    },
    { defaultPageSize: ADMIN_USERS_DEFAULT_PAGE_SIZE },
  );
}
