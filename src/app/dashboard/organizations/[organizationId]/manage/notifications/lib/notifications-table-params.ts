import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import {
  dashboardTablePath,
  type DashboardTableSearchParamsInput,
} from "@/lib/dashboard-table-search-params";

export function organizationNotificationsTablePath(
  organizationId: string,
  input: Pick<DashboardTableSearchParamsInput, "page"> = {},
): string {
  return dashboardTablePath(
    dashboardRoutes.organizationNotifications(organizationId),
    { page: input.page },
  );
}
