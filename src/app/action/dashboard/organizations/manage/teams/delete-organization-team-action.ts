"use server";

import { headers } from "next/headers";
import { canManageOrganization } from "@/app/dashboard/lib/dashboard-access";
import { getOrganizationTeamInOrg } from "@/app/dashboard/organizations/[organizationId]/manage/lib/organization-team-access";
import { invalidateOrganizationManageCache } from "@/app/action/dashboard/organizations/manage/shared/invalidate-organization-manage-cache";
import { getOrganizationManageActionErrorMessage } from "@/app/action/dashboard/organizations/manage/shared/organization-manage-action-error";
import { requireAuthSession } from "@/lib/auth-session";
import { auth } from "@/lib/auth";

type DeleteOrganizationTeamInput = {
  organizationId: string;
  teamId: string;
};

type DeleteOrganizationTeamResult = {
  success: boolean;
  error?: string;
};

export async function deleteOrganizationTeamAction(
  input: DeleteOrganizationTeamInput,
): Promise<DeleteOrganizationTeamResult> {
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

  if (team._count.teammembers > 0) {
    return {
      success: false,
      error: "Remove all team members before deleting this team.",
    };
  }

  try {
    await auth.api.removeTeam({
      headers: await headers(),
      body: {
        teamId: input.teamId,
        organizationId: input.organizationId,
      },
    });

    invalidateOrganizationManageCache(input.organizationId);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getOrganizationManageActionErrorMessage(
        error,
        "Could not delete the team.",
      ),
    };
  }
}
