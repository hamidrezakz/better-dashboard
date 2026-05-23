"use server";

import { updateTag } from "next/cache";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import { canManageOrganization } from "@/app/dashboard/lib/dashboard-access";
import type { InvitationMutationInput } from "@/app/dashboard/organizations/[organizationId]/manage/invitations/lib/invitation-mutation";
import {
  parseInvitationExpiresAt,
  resolveInvitationMaxUsesForSave,
  resolveInvitationPersistence,
} from "@/app/dashboard/organizations/[organizationId]/manage/invitations/lib/invitation-mutation";
import { requireAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

type CreateOrganizationInvitationInput = InvitationMutationInput & {
  organizationId: string;
};

type CreateOrganizationInvitationResult = {
  success: boolean;
  invitationId?: string;
  error?: string;
};

export async function createOrganizationInvitationAction(
  input: CreateOrganizationInvitationInput,
): Promise<CreateOrganizationInvitationResult> {
  const session = await requireAuthSession();
  const actorUserId = session.user.id;

  const canManage = await canManageOrganization({
    viewerUserId: actorUserId,
    organizationId: input.organizationId,
  });

  if (!canManage) {
    return {
      success: false,
      error: "شما دسترسی لازم برای مدیریت دعوت‌نامه‌های این سازمان را ندارید.",
    };
  }

  const resolved = resolveInvitationPersistence({
    organizationId: input.organizationId,
    joinScope: input.joinScope,
    teamId: input.teamId,
  });

  if (!resolved.ok) {
    return { success: false, error: resolved.error };
  }

  const expiresAt = parseInvitationExpiresAt(input.expiresAt);

  if (!expiresAt) {
    return {
      success: false,
      error: "تاریخ انقضا معتبر نیست.",
    };
  }

  if (expiresAt.getTime() <= Date.now()) {
    return {
      success: false,
      error: "تاریخ انقضا باید بعد از زمان فعلی باشد.",
    };
  }

  if (resolved.data.teamId) {
    const team = await prisma.team.findFirst({
      where: {
        id: resolved.data.teamId,
        organizationId: input.organizationId,
      },
      select: {
        id: true,
      },
    });

    if (!team) {
      return {
        success: false,
        error: "تیم انتخابی برای این سازمان معتبر نیست.",
      };
    }
  }

  const maxUses = resolveInvitationMaxUsesForSave(input.maxUses);

  if (maxUses === -1) {
    return {
      success: false,
      error: "حداکثر دفعات استفاده باید بزرگتر از صفر باشد.",
    };
  }

  const invitation = await prisma.invitation.create({
    data: {
      organizationId: resolved.data.organizationId,
      teamId: resolved.data.teamId,
      expiresAt,
      maxUses,
      inviterId: actorUserId,
    },
    select: {
      id: true,
    },
  });

  updateTag(
    dashboardCacheTags.organizationInvitationsById(input.organizationId),
  );

  return {
    success: true,
    invitationId: invitation.id,
  };
}
