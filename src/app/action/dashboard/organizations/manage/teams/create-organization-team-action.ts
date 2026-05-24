"use server";

import { headers } from "next/headers";
import { canManageOrganization } from "@/app/dashboard/lib/dashboard-access";
import { validateTeamName } from "@/app/dashboard/organizations/[organizationId]/manage/teams/lib/team-form-utils";
import { invalidateOrganizationManageCache } from "@/app/action/dashboard/organizations/manage/shared/invalidate-organization-manage-cache";
import { getOrganizationManageActionErrorMessage } from "@/app/action/dashboard/organizations/manage/shared/organization-manage-action-error";
import { requireAuthSession } from "@/lib/auth-session";
import { auth } from "@/lib/auth";

type CreateOrganizationTeamInput = {
  organizationId: string;
  name: string;
};

type CreateOrganizationTeamResult = {
  success: boolean;
  teamId?: string;
  error?: string;
};

export async function createOrganizationTeamAction(
  input: CreateOrganizationTeamInput,
): Promise<CreateOrganizationTeamResult> {
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

  try {
    const result = await auth.api.createTeam({
      headers: await headers(),
      body: {
        name: input.name.trim(),
        organizationId: input.organizationId,
      },
    });

    invalidateOrganizationManageCache(input.organizationId);

    return {
      success: true,
      teamId: result?.id,
    };
  } catch (error) {
    return {
      success: false,
      error: getOrganizationManageActionErrorMessage(
        error,
        "Could not create the team.",
      ),
    };
  }
}
