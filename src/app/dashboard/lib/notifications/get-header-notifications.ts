import { prisma } from "@/lib/prisma";
import type {
  NotificationAudience,
  NotificationType,
} from "@/generated/prisma/enums";
import {
  buildNotificationVisibilityWhere,
  getUserNotificationScope,
} from "@/app/dashboard/lib/notifications/notification-visibility";
import { buildNotificationSourceLabel } from "@/app/dashboard/lib/notifications/notification-source-label";

const HEADER_NOTIFICATIONS_LIMIT = 10;

export type HeaderNotificationItem = {
  id: string;
  title: string;
  body: string | null;
  type: NotificationType;
  audience: NotificationAudience;
  createdAt: string;
  readAt: string | null;
  organizationName: string | null;
  teamName: string | null;
  createdByName: string | null;
  sourceLabel: string | null;
};

export type HeaderNotificationsData = {
  items: HeaderNotificationItem[];
  hasMore: boolean;
  unreadTotalCount: number;
};

export async function getHeaderNotificationsData(
  userId: string,
): Promise<HeaderNotificationsData> {
  const scope = await getUserNotificationScope(userId);
  const visibilityWhere = buildNotificationVisibilityWhere({
    userId,
    organizationIds: scope.organizationIds,
    teamIds: scope.teamIds,
    unreadOnly: true,
  });

  const [notifications, unreadTotalCount] = await Promise.all([
    prisma.notification.findMany({
      where: visibilityWhere,
      include: {
        organization: {
          select: {
            name: true,
          },
        },
        team: {
          select: {
            name: true,
          },
        },
        createdBy: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: HEADER_NOTIFICATIONS_LIMIT + 1,
    }),
    prisma.notification.count({
      where: visibilityWhere,
    }),
  ]);

  const hasMore = notifications.length > HEADER_NOTIFICATIONS_LIMIT;
  const visibleNotifications = notifications.slice(
    0,
    HEADER_NOTIFICATIONS_LIMIT,
  );

  const items = visibleNotifications.map((notification) => {
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
      organizationName,
      teamName,
      createdByName,
      sourceLabel: buildNotificationSourceLabel({
        organizationName,
        teamName,
        createdByName,
      }),
    };
  });

  return {
    items,
    hasMore,
    unreadTotalCount,
  };
}
