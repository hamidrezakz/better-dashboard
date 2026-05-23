"use server";

import { updateTag } from "next/cache";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import {
  buildNotificationVisibilityWhere,
  getUserNotificationScope,
} from "@/app/dashboard/lib/notification-visibility";
import { requireAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

type MarkNotificationReadInput = {
  notificationId: string;
};

type MarkNotificationReadResult = {
  success: boolean;
  readAt?: string;
  error?: string;
};

export async function markNotificationReadAction(
  input: MarkNotificationReadInput,
): Promise<MarkNotificationReadResult> {
  const session = await requireAuthSession();
  const userId = session.user.id;

  const scope = await getUserNotificationScope(userId);
  const visibilityWhere = buildNotificationVisibilityWhere({
    userId,
    organizationIds: scope.organizationIds,
    teamIds: scope.teamIds,
  });

  const notification = await prisma.notification.findFirst({
    where: {
      id: input.notificationId,
      ...visibilityWhere,
    },
    select: {
      id: true,
      readAt: true,
      organizationId: true,
    },
  });

  if (!notification) {
    return {
      success: false,
      error: "اعلان موردنظر پیدا نشد.",
    };
  }

  let readAt = notification.readAt;

  if (!readAt) {
    readAt = new Date();
    await prisma.notification.update({
      where: { id: notification.id },
      data: { readAt },
    });
  }

  updateTag(dashboardCacheTags.userNotificationsByUserId(userId));

  if (notification.organizationId) {
    updateTag(
      dashboardCacheTags.organizationNotificationsById(
        notification.organizationId,
      ),
    );
  }

  return {
    success: true,
    readAt: readAt.toISOString(),
  };
}
