import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import {
  dataTablePath,
  type DataTableSearchParamsInput,
} from "@/lib/data-table/search-params";

export const ADMIN_ORGANIZATIONS_DEFAULT_PAGE_SIZE = 20;

export function adminOrganizationsTablePath(
  input: DataTableSearchParamsInput = {},
): string {
  return dataTablePath(
    dashboardRoutes.adminOrganizations(),
    {
      page: input.page,
      pageSize: input.pageSize,
      q: input.q,
    },
    { defaultPageSize: ADMIN_ORGANIZATIONS_DEFAULT_PAGE_SIZE },
  );
}
