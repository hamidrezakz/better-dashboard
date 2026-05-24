"use server";

import { headers } from "next/headers";
import { canManageOrganization } from "@/app/dashboard/lib/dashboard-access";
import { getOrganizationTeamInOrg } from "@/app/dashboard/organizations/[organizationId]/manage/lib/organization-team-access";
import { invalidateOrganizationManageCache } from "@/app/action/dashboard/organizations/manage/shared/invalidate-organization-manage-cache";
import { getOrganizationManageActionErrorMessage } from "@/app/action/dashboard/organizations/manage/shared/organization-manage-action-error";
import { requireAuthSession } from "@/lib/auth-session";
import { auth } from "@/lib/auth";
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

  const requestHeaders = await headers();
  let addedCount = 0;

  try {
    for (const userId of userIdsToAdd) {
      const existing = await prisma.teamMember.findFirst({
        where: {
          teamId: input.teamId,
          userId,
        },
        select: { id: true },
      });

      if (existing) {
        continue;
      }

      await auth.api.addTeamMember({
        headers: requestHeaders,
        body: {
          teamId: input.teamId,
          userId,
        },
      });
      addedCount += 1;
    }

    invalidateOrganizationManageCache(input.organizationId);

    return {
      success: true,
      addedCount,
    };
  } catch (error) {
    return {
      success: false,
      error: getOrganizationManageActionErrorMessage(
        error,
        "Could not add team members.",
      ),
    };
  }
}
