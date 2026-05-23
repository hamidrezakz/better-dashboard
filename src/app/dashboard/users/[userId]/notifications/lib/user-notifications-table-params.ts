import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import {
  dashboardTablePath,
  type DashboardTableSearchParamsInput,
} from "@/lib/dashboard-table-search-params";

export const USER_NOTIFICATIONS_PAGE_SIZE = 15;

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
  unread: "جدید",
  read: "خوانده‌شده",
};

export function userNotificationsTablePath(
  userId: string,
  input: DashboardTableSearchParamsInput & {
    filter?: UserNotificationTableFilter;
  } = {},
): string {
  const filter =
    input.filter && input.filter !== "unread" ? input.filter : undefined;

  return dashboardTablePath(dashboardRoutes.userNotifications(userId), {
    page: input.page,
    filter,
  });
}
