import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import {
  dataTablePath,
  type DataTableSearchParamsInput,
} from "@/lib/data-table/search-params";

export const USER_NOTIFICATIONS_DEFAULT_PAGE_SIZE = 20;

export type UserNotificationTableFilter = "unread" | "read";

const userNotificationTableFilters = new Set<UserNotificationTableFilter>([
  "unread",
  "read",
]);

export function parseUserNotificationTableFilter(
  value: string | undefined,
): UserNotificationTableFilter {
  if (
    value &&
    userNotificationTableFilters.has(value as UserNotificationTableFilter)
  ) {
    return value as UserNotificationTableFilter;
  }
  return "unread";
}

export const userNotificationFilterLabels: Record<
  UserNotificationTableFilter,
  string
> = {
  unread: "Unread",
  read: "Read",
};

export function userNotificationsTablePath(
  input: DataTableSearchParamsInput & {
    filter?: UserNotificationTableFilter;
  } = {},
): string {
  const filter =
    input.filter && input.filter !== "unread" ? input.filter : undefined;

  return dataTablePath(
    dashboardRoutes.userNotifications(),
    {
      page: input.page,
      pageSize: input.pageSize,
      filter,
    },
    { defaultPageSize: USER_NOTIFICATIONS_DEFAULT_PAGE_SIZE },
  );
}
