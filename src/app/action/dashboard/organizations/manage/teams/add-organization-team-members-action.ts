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

type AddOrganizationTeamMembersInput = {
  organizationId: string;
  teamId: string;
  userIds: string[];
};

type AddOrganizationTeamMembersResult = {
  success: boolean;
  addedCount?: number;
  error?: string;
};

export async function addOrganizationTeamMembersAction(
  input: AddOrganizationTeamMembersInput,
): Promise<AddOrganizationTeamMembersResult> {
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

  const uniqueUserIds = [...new Set(input.userIds.filter(Boolean))];

  if (!uniqueUserIds.length) {
    return {
      success: false,
      error: "Select at least one member to add.",
    };
  }

  const team = await getOrganizationTeamInOrg({
    organizationId: input.organizationId,
    teamId: input.teamId,
  });

  if (!team) {
    return { success: false, error: "Team not found." };
  }

  const orgMembers = await prisma.member.findMany({
    where: {
      organizationId: input.organizationId,
      userId: { in: uniqueUserIds },
    },
    select: {
      userId: true,
    },
  });

  const allowedUserIds = new Set(orgMembers.map((member) => member.userId));
  const userIdsToAdd = uniqueUserIds.filter((userId) =>
    allowedUserIds.has(userId),
  );

  if (!userIdsToAdd.length) {
    return {
      success: false,
      error: "Selected users must be organization members.",
    };
  }

  const existing = await prisma.teamMember.findMany({
    where: {
      teamId: input.teamId,
      userId: { in: userIdsToAdd },
    },
    select: { userId: true },
  });

  const existingIds = new Set(existing.map((row) => row.userId));
  const toCreate = userIdsToAdd.filter((userId) => !existingIds.has(userId));

  if (toCreate.length) {
    const now = new Date();

    await prisma.teamMember.createMany({
      data: toCreate.map((userId) => ({
        userId,
        teamId: input.teamId,
        createdAt: now,
      })),
    });

    await prisma.team.update({
      where: { id: input.teamId },
      data: { updatedAt: now },
    });
  }

  invalidateOrganizationTeamsCache(input.organizationId);
  invalidateOrganizationMembersCache(input.organizationId);
  invalidateOrganizationSummaryCache(input.organizationId);

  return {
    success: true,
    addedCount: toCreate.length,
  };
}
