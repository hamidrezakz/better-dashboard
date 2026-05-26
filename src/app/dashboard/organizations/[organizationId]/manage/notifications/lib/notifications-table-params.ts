import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import { NOTIFICATIONS_DEFAULT_PAGE_SIZE } from "@/app/dashboard/organizations/[organizationId]/manage/notifications/lib/notification-form-utils";
import {
  dataTablePath,
  type DataTableSearchParamsInput,
} from "@/lib/data-table/search-params";

export function organizationNotificationsTablePath(
  organizationId: string,
  input: Pick<DataTableSearchParamsInput, "page" | "pageSize"> = {},
): string {
  return dataTablePath(
    dashboardRoutes.organizationNotifications(organizationId),
    { page: input.page, pageSize: input.pageSize },
    { defaultPageSize: NOTIFICATIONS_DEFAULT_PAGE_SIZE },
  );
}
