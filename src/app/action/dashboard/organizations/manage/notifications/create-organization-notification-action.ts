"use server";

import {
  NotificationAudience,
  NotificationType,
} from "@/generated/prisma/enums";
import { updateTag } from "next/cache";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import { canManageOrganization } from "@/app/dashboard/lib/dashboard-access";
import { requireAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

type CreateOrganizationNotificationInput = {
  organizationId: string;
  title: string;
  body?: string;
  audience: NotificationAudience;
  userId?: string;
  teamId?: string;
};

type CreateOrganizationNotificationResult = {
  success: boolean;
  error?: string;
};

async function isUserRelatedToOrganization(input: {
  userId: string;
  organizationId: string;
}) {
  const [organizationMembership, teamMembership] = await Promise.all([
    prisma.member.findFirst({
      where: {
        organizationId: input.organizationId,
        userId: input.userId,
      },
      select: {
        id: true,
      },
    }),
    prisma.teamMember.findFirst({
      where: {
        userId: input.userId,
        team: {
          organizationId: input.organizationId,
        },
      },
      select: {
        id: true,
      },
    }),
  ]);

  return Boolean(organizationMembership || teamMembership);
}

export async function createOrganizationNotificationAction(
  input: CreateOrganizationNotificationInput,
): Promise<CreateOrganizationNotificationResult> {
  const session = await requireAuthSession();
  const actorUserId = session.user.id;

  const canManage = await canManageOrganization({
    viewerUserId: actorUserId,
    organizationId: input.organizationId,
  });

  if (!canManage) {
    return {
      success: false,
      error: "مجوز ارسال اعلان سازمانی را ندارید.",
    };
  }

  const title = input.title.trim();
  if (!title) {
    return {
      success: false,
      error: "عنوان اعلان الزامی است.",
    };
  }

  if (input.audience === NotificationAudience.user_direct && !input.userId) {
    return {
      success: false,
      error: "برای اعلان مستقیم یک کاربر انتخاب کنید.",
    };
  }

  if (input.audience === NotificationAudience.team && !input.teamId) {
    return {
      success: false,
      error: "برای اعلان تیمی یک تیم انتخاب کنید.",
    };
  }

  if (input.userId) {
    const relatedUser = await isUserRelatedToOrganization({
      organizationId: input.organizationId,
      userId: input.userId,
    });

    if (!relatedUser) {
      return {
        success: false,
        error: "کاربر انتخاب‌شده به این سازمان یا تیم مرتبط نیست.",
      };
    }
  }

  if (input.teamId) {
    const team = await prisma.team.findFirst({
      where: {
        id: input.teamId,
        organizationId: input.organizationId,
      },
      select: {
        id: true,
      },
    });

    if (!team) {
      return {
        success: false,
        error: "تیم انتخاب‌شده معتبر نیست.",
      };
    }
  }

  const notificationType = NotificationType.organization;

  await prisma.notification.create({
    data: {
      title,
      body: input.body?.trim() || null,
      type: notificationType,
      audience: input.audience,
      organizationId: input.organizationId,
      userId: input.userId || null,
      teamId: input.teamId || null,
      createdById: actorUserId,
    },
  });

  updateTag(
    dashboardCacheTags.organizationNotificationsById(input.organizationId),
  );

  return {
    success: true,
  };
}
