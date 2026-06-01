"use server";

import { canManageOrganization } from "@/app/dashboard/lib/dashboard-access";
import { validateTeamName } from "@/app/dashboard/organizations/[organizationId]/manage/teams/lib/team-form-utils";
import {
  invalidateOrganizationSummaryCache,
  invalidateOrganizationTeamsCache,
} from "@/app/action/dashboard/organizations/manage/shared/invalidate-organization-manage-cache";
import { requireAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

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
      error: "مجوز مدیریت تیم‌های این سازمان را ندارید.",
    };
  }

  const nameError = validateTeamName(input.name);

  if (nameError) {
    return { success: false, error: nameError };
  }

  const now = new Date();

  const team = await prisma.team.create({
    data: {
      name: input.name.trim(),
      organizationId: input.organizationId,
      createdAt: now,
      updatedAt: now,
    },
    select: {
      id: true,
    },
  });

  invalidateOrganizationTeamsCache(input.organizationId);
  invalidateOrganizationSummaryCache(input.organizationId);

  return {
    success: true,
    teamId: team.id,
  };
}
