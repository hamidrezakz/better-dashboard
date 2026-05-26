"use server";

import type {
  NotificationAudience,
  NotificationType,
} from "@/generated/prisma/enums";
import { updateTag } from "next/cache";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import { canManageOrganization } from "@/app/dashboard/lib/dashboard-access";
import { requireAuthSession } from "@/lib/session";
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
      error: "You don't have permission to send organization notifications.",
    };
  }

  const title = input.title.trim();
  if (!title) {
    return {
      success: false,
      error: "Notification title is required.",
    };
  }

  if (input.audience === "USER_DIRECT" && !input.userId) {
    return {
      success: false,
      error: "Select a user for direct notifications.",
    };
  }

  if (input.audience === "TEAM" && !input.teamId) {
    return {
      success: false,
      error: "Select a team for team notifications.",
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
        error: "The selected user is not linked to this organization or team.",
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
        error: "The selected team is not valid.",
      };
    }
  }

  const notificationType: NotificationType = "ORGANIZATION";

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
