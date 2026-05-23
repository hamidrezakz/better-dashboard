import { cacheLife, cacheTag } from "next/cache";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import {
  NOTIFICATIONS_PAGE_SIZE,
  type OrganizationNotificationItem,
} from "@/app/dashboard/organizations/[organizationId]/manage/notifications/lib/notification-form-utils";
import { prisma } from "@/lib/prisma";
import {
  clampDashboardTablePage,
  parseDashboardTablePage,
} from "@/lib/dashboard-table-search-params";

export type OrganizationNotificationsPageQuery = {
  page: number;
  pageSize: number;
};

export function parseOrganizationNotificationsPageQuery(
  searchParams: Record<string, string | string[] | undefined>,
): OrganizationNotificationsPageQuery {
  return {
    page: parseDashboardTablePage(searchParams),
    pageSize: NOTIFICATIONS_PAGE_SIZE,
  };
}

export type OrganizationNotificationsPageResult = {
  teams: Array<{ id: string; name: string }>;
  notifications: OrganizationNotificationItem[];
  totalCount: number;
  page: number;
  pageSize: number;
};

export async function getOrganizationNotificationsPage(
  organizationId: string,
  query: OrganizationNotificationsPageQuery,
) {
  "use cache";

  cacheLife("minutes");
  cacheTag(dashboardCacheTags.organizationNotificationsById(organizationId));

  const notificationWhere = { organizationId };

  const [teams, totalCount] = await Promise.all([
    prisma.team.findMany({
      where: { organizationId },
      select: { id: true, name: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.notification.count({ where: notificationWhere }),
  ]);

  const page = clampDashboardTablePage(query.page, totalCount, query.pageSize);
  const skip = (page - 1) * query.pageSize;

  const notifications = await prisma.notification.findMany({
    where: notificationWhere,
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
      team: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: query.pageSize,
  });

  return {
    teams,
    notifications: notifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      body: notification.body,
      type: notification.type,
      audience: notification.audience,
      createdAt: notification.createdAt.toISOString(),
      userId: notification.userId,
      userName: notification.user?.name ?? null,
      userEmail: notification.user?.email ?? null,
      userImage: notification.user?.image ?? null,
      teamId: notification.teamId,
      teamName: notification.team?.name ?? null,
    })),
    totalCount,
    page,
    pageSize: query.pageSize,
  } satisfies OrganizationNotificationsPageResult;
}
