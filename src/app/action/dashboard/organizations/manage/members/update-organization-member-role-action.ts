"use server";

import { canManageOrganization } from "@/app/dashboard/lib/dashboard-access";
import {
  canActorModifyMemberRole,
  countOrganizationOwners,
  getActorOrganizationRoleForManage,
  getOrganizationMemberById,
} from "@/app/dashboard/organizations/[organizationId]/manage/lib/organization-member-guards";
import {
  invalidateOrganizationMembersCache,
  invalidateOrganizationSummaryCache,
} from "@/app/action/dashboard/organizations/manage/shared/invalidate-organization-manage-cache";
import { MembershipRole } from "@/generated/prisma/enums";
import { requireAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

type UpdateOrganizationMemberRoleInput = {
  organizationId: string;
  memberId: string;
  role: MembershipRole;
};

type UpdateOrganizationMemberRoleResult = {
  success: boolean;
  error?: string;
};

const ALLOWED_ROLES = Object.values(MembershipRole) as MembershipRole[];

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
      error: "مجوز مدیریت اعضای این سازمان را ندارید.",
    };
  }

  if (!ALLOWED_ROLES.includes(input.role)) {
    return { success: false, error: "نقش معتبر نیست." };
  }

  const member = await getOrganizationMemberById({
    organizationId: input.organizationId,
    memberId: input.memberId,
  });

  if (!member) {
    return { success: false, error: "عضو یافت نشد." };
  }

  if (member.role === input.role) {
    return { success: true };
  }

  const actorRole = await getActorOrganizationRoleForManage({
    actorUserId,
    organizationId: input.organizationId,
  });

  if (!actorRole) {
    return {
      success: false,
      error: "مجوز تغییر نقش اعضا را ندارید.",
    };
  }

  if (!canActorModifyMemberRole({ actorRole, role: member.role })) {
    return {
      success: false,
      error: "مجوز تغییر نقش این عضو را ندارید.",
    };
  }

  if (!canActorModifyMemberRole({ actorRole, role: input.role })) {
    return {
      success: false,
      error: "مجوز اختصاص این نقش را ندارید.",
    };
  }

  if (
    member.role === MembershipRole.owner &&
    input.role !== MembershipRole.owner
  ) {
    const ownerCount = await countOrganizationOwners(input.organizationId);

    if (ownerCount <= 1) {
      return {
        success: false,
        error: "قبل از تغییر نقش این عضو، مالک دیگری تعیین کنید.",
      };
    }
  }

  await prisma.member.update({
    where: { id: input.memberId },
    data: { role: input.role },
  });

  invalidateOrganizationMembersCache(input.organizationId);
  invalidateOrganizationSummaryCache(input.organizationId);

  return { success: true };
}
