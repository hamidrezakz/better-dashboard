"use server";

import { updateTag } from "next/cache";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import { canManageOrganization } from "@/app/dashboard/lib/dashboard-access";
import { organizationInvitationByIdWhere } from "@/app/dashboard/organizations/[organizationId]/manage/invitations/lib/organization-invitation-access";
import type { InvitationMutationInput } from "@/app/dashboard/organizations/[organizationId]/manage/invitations/lib/invitation-mutation";
import {
  parseInvitationExpiresAt,
  resolveInvitationMaxUsesForSave,
  resolveInvitationPersistence,
} from "@/app/dashboard/organizations/[organizationId]/manage/invitations/lib/invitation-mutation";
import { requireAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

type UpdateOrganizationInvitationInput = InvitationMutationInput & {
  organizationId: string;
  invitationId: string;
};

type UpdateOrganizationInvitationResult = {
  success: boolean;
  error?: string;
};

export async function updateOrganizationInvitationAction(
  input: UpdateOrganizationInvitationInput,
): Promise<UpdateOrganizationInvitationResult> {
  const session = await requireAuthSession();
  const actorUserId = session.user.id;

  const canManage = await canManageOrganization({
    viewerUserId: actorUserId,
    organizationId: input.organizationId,
  });

  if (!canManage) {
    return {
      success: false,
      error:
        "You don't have permission to manage invitations for this organization.",
    };
  }

  const invitation = await prisma.invitation.findFirst({
    where: organizationInvitationByIdWhere({
      organizationId: input.organizationId,
      invitationId: input.invitationId,
    }),
    select: {
      id: true,
    },
  });

  if (!invitation) {
    return {
      success: false,
      error: "Invitation not found.",
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
      error: "Expiration date is not valid.",
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
        error: "The selected team is not valid for this organization.",
      };
    }
  }

  const maxUses = resolveInvitationMaxUsesForSave(input.maxUses);

  if (maxUses === -1) {
    return {
      success: false,
      error: "Maximum uses must be greater than zero.",
    };
  }

  await prisma.invitation.update({
    where: {
      id: input.invitationId,
    },
    data: {
      organizationId: resolved.data.organizationId,
      teamId: resolved.data.teamId,
      expiresAt,
      maxUses,
    },
  });

  updateTag(
    dashboardCacheTags.organizationInvitationsById(input.organizationId),
  );

  return {
    success: true,
  };
}
