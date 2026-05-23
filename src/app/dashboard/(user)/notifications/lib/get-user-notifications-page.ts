import { cacheLife, cacheTag } from "next/cache";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import {
  buildNotificationVisibilityWhere,
  getUserNotificationScope,
} from "@/app/dashboard/lib/notification-visibility";
import type { NotificationViewItem } from "@/app/dashboard/lib/notification-view-types";
import { buildNotificationSourceInline } from "@/app/dashboard/lib/notification-source-label";
import {
  parseUserNotificationTableFilter,
  USER_NOTIFICATIONS_PAGE_SIZE,
  type UserNotificationTableFilter,
} from "@/app/dashboard/(user)/notifications/lib/user-notifications-table-params";
import { prisma } from "@/lib/prisma";
import {
  clampDashboardTablePage,
  parseDashboardTableFilter,
  parseDashboardTablePage,
} from "@/lib/dashboard-table-search-params";

export type UserNotificationsPageQuery = {
  page: number;
  pageSize: number;
  filter: UserNotificationTableFilter;
};

export function parseUserNotificationsPageQuery(
  searchParams: Record<string, string | string[] | undefined>,
): UserNotificationsPageQuery {
  return {
    page: parseDashboardTablePage(searchParams),
    pageSize: USER_NOTIFICATIONS_PAGE_SIZE,
    filter: parseUserNotificationTableFilter(
      parseDashboardTableFilter(searchParams),
    ),
  };
}

export type UserNotificationListItem = NotificationViewItem;

export type UserNotificationsPageResult = {
  notifications: UserNotificationListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  filter: UserNotificationTableFilter;
};

function buildListWhere(
  scope: Awaited<ReturnType<typeof getUserNotificationScope>>,
  userId: string,
  filter: UserNotificationTableFilter,
) {
  const base = buildNotificationVisibilityWhere({
    userId,
    organizationIds: scope.organizationIds,
    teamIds: scope.teamIds,
    unreadOnly: filter === "unread",
  });

  if (filter === "read") {
    return {
      AND: [base, { readAt: { not: null } }],
    };
  }

  return base;
}

export async function getUserNotificationsPage(
  userId: string,
  query: UserNotificationsPageQuery,
): Promise<UserNotificationsPageResult> {
  "use cache";

  cacheLife("minutes");
  cacheTag(dashboardCacheTags.userNotificationsByUserId(userId));

  const scope = await getUserNotificationScope(userId);
  const where = buildListWhere(scope, userId, query.filter);

  const totalCount = await prisma.notification.count({ where });
  const page = clampDashboardTablePage(query.page, totalCount, query.pageSize);
  const skip = (page - 1) * query.pageSize;

  const notifications = await prisma.notification.findMany({
    where,
    include: {
      organization: { select: { name: true } },
      team: { select: { name: true } },
      createdBy: { select: { name: true } },
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy:
      query.filter === "read" ? { readAt: "desc" } : { createdAt: "desc" },
    skip,
    take: query.pageSize,
  });

  return {
    notifications: notifications.map((notification) => {
      const organizationName = notification.organization?.name ?? null;
      const teamName = notification.team?.name ?? null;
      const createdByName = notification.createdBy?.name ?? null;

      return {
        id: notification.id,
        title: notification.title,
        body: notification.body,
        type: notification.type,
        audience: notification.audience,
        createdAt: notification.createdAt.toISOString(),
        readAt: notification.readAt?.toISOString() ?? null,
        userName: notification.user?.name ?? null,
        userEmail: notification.user?.email ?? null,
        userImage: notification.user?.image ?? null,
        teamName,
        organizationName,
        createdByName,
        sourceLabel: buildNotificationSourceInline({
          organizationName,
          teamName,
          createdByName,
        }),
      };
    }),
    totalCount,
    page,
    pageSize: query.pageSize,
    filter: query.filter,
  };
}
