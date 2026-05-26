"use server";

import { canManageOrganization } from "@/app/dashboard/lib/dashboard-access";
import { getOrganizationMemberById } from "@/app/dashboard/organizations/[organizationId]/manage/lib/organization-member-guards";
import {
  invalidateOrganizationManageCache,
  invalidateOrganizationTeamProfileCache,
  invalidateUserProfileCache,
} from "@/app/action/dashboard/organizations/manage/shared/invalidate-organization-manage-cache";
import { requireAuthSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

type SetOrganizationMemberTeamsInput = {
  organizationId: string;
  memberId: string;
  teamIds: string[];
};

type SetOrganizationMemberTeamsResult = {
  success: boolean;
  error?: string;
};

export async function setOrganizationMemberTeamsAction(
  input: SetOrganizationMemberTeamsInput,
): Promise<SetOrganizationMemberTeamsResult> {
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
        "You don't have permission to manage members for this organization.",
    };
  }

  const member = await getOrganizationMemberById({
    organizationId: input.organizationId,
    memberId: input.memberId,
  });

  if (!member) {
    return { success: false, error: "Member not found." };
  }

  const uniqueTeamIds = [...new Set(input.teamIds.filter(Boolean))];

  const validTeams = await prisma.team.findMany({
    where: {
      organizationId: input.organizationId,
      id: { in: uniqueTeamIds },
    },
    select: { id: true },
  });

  const validTeamIds = new Set(validTeams.map((team) => team.id));
  const nextTeamIds = uniqueTeamIds.filter((teamId) =>
    validTeamIds.has(teamId),
  );

  const currentMemberships = await prisma.teamMember.findMany({
    where: {
      userId: member.userId,
      team: {
        organizationId: input.organizationId,
      },
    },
    select: {
      teamId: true,
    },
  });

  const currentTeamIds = new Set(
    currentMemberships.map((membership) => membership.teamId),
  );
  const nextTeamIdSet = new Set(nextTeamIds);

  const toAdd = nextTeamIds.filter((teamId) => !currentTeamIds.has(teamId));
  const toRemove = [...currentTeamIds].filter(
    (teamId) => !nextTeamIdSet.has(teamId),
  );

  const now = new Date();

  if (toRemove.length) {
    await prisma.teamMember.deleteMany({
      where: {
        userId: member.userId,
        teamId: { in: toRemove },
      },
    });

    await prisma.team.updateMany({
      where: { id: { in: toRemove } },
      data: { updatedAt: now },
    });
  }

  if (toAdd.length) {
    await prisma.teamMember.createMany({
      data: toAdd.map((teamId) => ({
        teamId,
        userId: member.userId,
        createdAt: now,
      })),
    });

    await prisma.team.updateMany({
      where: { id: { in: toAdd } },
      data: { updatedAt: now },
    });
  }

  invalidateOrganizationManageCache(input.organizationId);
  invalidateUserProfileCache(member.userId);

  for (const teamId of [...toAdd, ...toRemove]) {
    invalidateOrganizationTeamProfileCache(input.organizationId, teamId);
  }

  return { success: true };
}
