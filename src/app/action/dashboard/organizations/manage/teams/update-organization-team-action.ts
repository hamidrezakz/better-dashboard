"use server";

import { canManageOrganization } from "@/app/dashboard/lib/dashboard-access";
import { getOrganizationTeamInOrg } from "@/app/dashboard/organizations/[organizationId]/manage/lib/organization-team-access";
import { validateTeamName } from "@/app/dashboard/organizations/[organizationId]/manage/teams/lib/team-form-utils";
import { invalidateOrganizationManageCache } from "@/app/action/dashboard/organizations/manage/shared/invalidate-organization-manage-cache";
import { requireAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

type UpdateOrganizationTeamInput = {
  organizationId: string;
  teamId: string;
  name: string;
};

type UpdateOrganizationTeamResult = {
  success: boolean;
  error?: string;
};

export async function updateOrganizationTeamAction(
  input: UpdateOrganizationTeamInput,
): Promise<UpdateOrganizationTeamResult> {
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

  const nameError = validateTeamName(input.name);

  if (nameError) {
    return { success: false, error: nameError };
  }

  const team = await getOrganizationTeamInOrg({
    organizationId: input.organizationId,
    teamId: input.teamId,
  });

  if (!team) {
    return { success: false, error: "Team not found." };
  }

  await prisma.team.update({
    where: { id: input.teamId },
    data: {
      name: input.name.trim(),
      updatedAt: new Date(),
    },
  });

  invalidateOrganizationManageCache(input.organizationId);

  return { success: true };
}
