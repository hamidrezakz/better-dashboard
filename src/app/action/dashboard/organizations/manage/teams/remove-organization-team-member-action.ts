"use server";

import { canManageOrganization } from "@/app/dashboard/lib/dashboard-access";
import { getOrganizationTeamInOrg } from "@/app/dashboard/organizations/[organizationId]/lib/get-organization-team-in-org";
import {
  invalidateOrganizationMembersCache,
  invalidateOrganizationSummaryCache,
  invalidateOrganizationTeamProfileCache,
  invalidateOrganizationTeamsCache,
  invalidateUserProfileCache,
} from "@/app/action/dashboard/organizations/manage/shared/invalidate-organization-manage-cache";
import { requireAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

type RemoveOrganizationTeamMemberInput = {
  organizationId: string;
  teamId: string;
  userId: string;
};

type RemoveOrganizationTeamMemberResult = {
  success: boolean;
  error?: string;
};

export async function removeOrganizationTeamMemberAction(
  input: RemoveOrganizationTeamMemberInput,
): Promise<RemoveOrganizationTeamMemberResult> {
  const session = await requireAuthSession();
  const actorUserId = session.user.id;

  const canManage = await canManageOrganization({
    viewerUserId: actorUserId,
    organizationId: input.organizationId,
  });

  if (!canManage) {
    return {
      success: false,
      error: "مجوز مدیریت تیم‌های این سازمان را ندارید.",
    };
  }

  const team = await getOrganizationTeamInOrg({
    organizationId: input.organizationId,
    teamId: input.teamId,
  });

  if (!team) {
    return { success: false, error: "تیم یافت نشد." };
  }

  await prisma.teamMember.deleteMany({
    where: {
      teamId: input.teamId,
      userId: input.userId,
    },
  });

  await prisma.team.update({
    where: { id: input.teamId },
    data: { updatedAt: new Date() },
  });

  invalidateOrganizationTeamsCache(input.organizationId);
  invalidateOrganizationMembersCache(input.organizationId);
  invalidateOrganizationSummaryCache(input.organizationId);
  invalidateOrganizationTeamProfileCache(input.organizationId, input.teamId);
  invalidateUserProfileCache(input.userId);

  return { success: true };
}
