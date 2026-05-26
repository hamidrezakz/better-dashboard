"use server";

import { updateTag } from "next/cache";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import {
  buildNotificationVisibilityWhere,
  getUserNotificationScope,
} from "@/app/dashboard/lib/notifications/notification-visibility";
import { requireAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

type MarkAllNotificationsAsReadResult = {
  success: boolean;
  count?: number;
  error?: string;
};

export async function markAllNotificationsAsReadAction(): Promise<MarkAllNotificationsAsReadResult> {
  const session = await requireAuthSession();
  const userId = session.user.id;

  const scope = await getUserNotificationScope(userId);
  const visibilityWhere = buildNotificationVisibilityWhere({
    userId,
    organizationIds: scope.organizationIds,
    teamIds: scope.teamIds,
    unreadOnly: true,
  });

  const now = new Date();

  const updateResult = await prisma.notification.updateMany({
    where: {
      AND: [visibilityWhere, { readAt: null }],
    },
    data: {
      readAt: now,
    },
  });

  updateTag(dashboardCacheTags.userNotificationsByUserId(userId));

  return {
    success: true,
    count: updateResult.count,
  };
}
