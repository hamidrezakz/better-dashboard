"use server";

import { headers } from "next/headers";
import {
  canManageOrganization,
  isDashboardSuperAdmin,
} from "@/app/dashboard/lib/dashboard-access";
import {
  canActorAssignRole,
  canActorChangeMemberRole,
  countOrganizationOwners,
  getActorOrganizationRole,
  getOrganizationMemberById,
} from "@/app/dashboard/organizations/[organizationId]/manage/lib/organization-member-guards";
import { invalidateOrganizationManageCache } from "@/app/action/dashboard/organizations/manage/shared/invalidate-organization-manage-cache";
import { getOrganizationManageActionErrorMessage } from "@/app/action/dashboard/organizations/manage/shared/organization-manage-action-error";
import type { MembershipRole } from "@/generated/prisma/enums";
import { requireAuthSession } from "@/lib/auth-session";
import { auth } from "@/lib/auth";
type UpdateOrganizationMemberRoleInput = {
  organizationId: string;
  memberId: string;
  role: MembershipRole;
};

type UpdateOrganizationMemberRoleResult = {
  success: boolean;
  error?: string;
};

const ALLOWED_ROLES: MembershipRole[] = ["OWNER", "ADMIN", "MEMBER"];

export async function updateOrganizationMemberRoleAction(
  input: UpdateOrganizationMemberRoleInput,
): Promise<UpdateOrganizationMemberRoleResult> {
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

  if (!ALLOWED_ROLES.includes(input.role)) {
    return { success: false, error: "Role is not valid." };
  }

  const member = await getOrganizationMemberById({
    organizationId: input.organizationId,
    memberId: input.memberId,
  });

  if (!member) {
    return { success: false, error: "Member not found." };
  }

  if (member.role === input.role) {
    return { success: true };
  }

  const actorRole = isDashboardSuperAdmin(actorUserId)
    ? "OWNER"
    : await getActorOrganizationRole({
        actorUserId,
        organizationId: input.organizationId,
      });

  if (!actorRole) {
    return {
      success: false,
      error: "You don't have permission to change member roles.",
    };
  }

  if (!canActorChangeMemberRole({ actorRole, targetRole: member.role })) {
    return {
      success: false,
      error: "You don't have permission to change this member's role.",
    };
  }

  if (!canActorAssignRole({ actorRole, nextRole: input.role })) {
    return {
      success: false,
      error: "You don't have permission to assign this role.",
    };
  }

  if (member.role === "OWNER" && input.role !== "OWNER") {
    const ownerCount = await countOrganizationOwners(input.organizationId);

    if (ownerCount <= 1) {
      return {
        success: false,
        error: "Assign another owner before changing this member's role.",
      };
    }
  }

  try {
    await auth.api.updateMemberRole({
      headers: await headers(),
      body: {
        memberId: input.memberId,
        role: input.role.toLowerCase(),
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
        "Could not update the member role.",
      ),
    };
  }
}
