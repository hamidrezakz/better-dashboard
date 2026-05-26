"use server";

import { canManageOrganization } from "@/app/dashboard/lib/dashboard-access";
import { getOrganizationTeamInOrg } from "@/app/dashboard/organizations/[organizationId]/manage/teams/lib/organization-team-access";
import {
  invalidateOrganizationMembersCache,
  invalidateOrganizationSummaryCache,
  invalidateOrganizationTeamsCache,
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
      error: "You don't have permission to manage teams for this organization.",
    };
  }

  const team = await getOrganizationTeamInOrg({
    organizationId: input.organizationId,
    teamId: input.teamId,
  });

  if (!team) {
    return { success: false, error: "Team not found." };
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

  return { success: true };
}
