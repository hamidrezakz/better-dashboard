"use server";

import {
  canManageOrganization,
  isDashboardSuperAdmin,
} from "@/app/dashboard/lib/dashboard-access";
import {
  countOrganizationOwners,
  getOrganizationMemberById,
} from "@/app/dashboard/organizations/[organizationId]/manage/lib/organization-member-guards";
import { invalidateOrganizationManageCache } from "@/app/action/dashboard/organizations/manage/shared/invalidate-organization-manage-cache";
import { requireAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

type RemoveOrganizationMemberInput = {
  organizationId: string;
  memberId: string;
};

type RemoveOrganizationMemberResult = {
  success: boolean;
  error?: string;
};

export async function removeOrganizationMemberAction(
  input: RemoveOrganizationMemberInput,
): Promise<RemoveOrganizationMemberResult> {
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

  if (member.userId === actorUserId && !isDashboardSuperAdmin(actorUserId)) {
    return {
      success: false,
      error: "You cannot remove yourself from the organization.",
    };
  }

  if (member.role === "OWNER") {
    const ownerCount = await countOrganizationOwners(input.organizationId);

    if (ownerCount <= 1) {
      return {
        success: false,
        error: "Assign another owner before removing this member.",
      };
    }
  }

  await prisma.$transaction([
    prisma.teamMember.deleteMany({
      where: {
        userId: member.userId,
        team: {
          organizationId: input.organizationId,
        },
      },
    }),
    prisma.member.delete({
      where: { id: input.memberId },
    }),
  ]);

  invalidateOrganizationManageCache(input.organizationId);

  return { success: true };
}
