"use server";

import { canManageOrganization } from "@/app/dashboard/lib/dashboard-access";
import {
  canActorRemoveMember,
  countOrganizationOwners,
  getOrganizationMemberById,
} from "@/app/dashboard/organizations/[organizationId]/manage/lib/organization-member-guards";
import {
  invalidateOrganizationMembersCache,
  invalidateOrganizationSummaryCache,
  invalidateOrganizationTeamsCache,
} from "@/app/action/dashboard/organizations/manage/shared/invalidate-organization-manage-cache";
import { invalidateUserDashboardCache } from "@/app/action/dashboard/users/account/shared/invalidate-user-dashboard-cache";
import { MembershipRole } from "@/generated/prisma/enums";
import { requireAuthSession } from "@/lib/auth/session";
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
      error: "مجوز مدیریت اعضای این سازمان را ندارید.",
    };
  }

  const member = await getOrganizationMemberById({
    organizationId: input.organizationId,
    memberId: input.memberId,
  });

  if (!member) {
    return { success: false, error: "عضو یافت نشد." };
  }

  if (
    !(await canActorRemoveMember({
      actorUserId,
      memberUserId: member.userId,
    }))
  ) {
    return {
      success: false,
      error: "نمی‌توانید خودتان را از سازمان حذف کنید.",
    };
  }

  if (member.role === MembershipRole.owner) {
    const ownerCount = await countOrganizationOwners(input.organizationId);

    if (ownerCount <= 1) {
      return {
        success: false,
        error: "قبل از حذف این عضو، مالک دیگری تعیین کنید.",
      };
    }
  }

  await prisma.member.delete({
    where: { id: input.memberId },
  });

  invalidateOrganizationMembersCache(input.organizationId);
  invalidateOrganizationTeamsCache(input.organizationId);
  invalidateOrganizationSummaryCache(input.organizationId);
  invalidateUserDashboardCache(member.userId);

  return { success: true };
}
