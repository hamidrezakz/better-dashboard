"use server";

import { updateTag } from "next/cache";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import { canManageOrganization } from "@/app/dashboard/lib/dashboard-access";
import { requireAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

type DeleteOrganizationNotificationInput = {
  organizationId: string;
  notificationId: string;
};

type DeleteOrganizationNotificationResult = {
  success: boolean;
  error?: string;
};

export async function deleteOrganizationNotificationAction(
  input: DeleteOrganizationNotificationInput,
): Promise<DeleteOrganizationNotificationResult> {
  const session = await requireAuthSession();
  const actorUserId = session.user.id;

  const canManage = await canManageOrganization({
    viewerUserId: actorUserId,
    organizationId: input.organizationId,
  });

  if (!canManage) {
    return {
      success: false,
      error: "مجوز حذف اعلان‌های این سازمان را ندارید.",
    };
  }

  const notification = await prisma.notification.findFirst({
    where: {
      id: input.notificationId,
      organizationId: input.organizationId,
    },
    select: { id: true },
  });

  if (!notification) {
    return {
      success: false,
      error: "اعلان یافت نشد.",
    };
  }

  await prisma.notification.delete({
    where: { id: notification.id },
  });

  updateTag(
    dashboardCacheTags.organizationNotificationsById(input.organizationId),
  );

  return { success: true };
}
