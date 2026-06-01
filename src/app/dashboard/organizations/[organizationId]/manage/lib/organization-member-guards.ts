import { MembershipRole } from "@/generated/prisma/enums";
import { getUserOrganizationRole } from "@/app/dashboard/lib/dashboard-access";
import { isPlatformAdmin } from "@/lib/auth/user-role";
import { prisma } from "@/lib/prisma";

export async function getOrganizationMemberById(input: {
  organizationId: string;
  memberId: string;
}) {
  return prisma.member.findFirst({
    where: {
      id: input.memberId,
      organizationId: input.organizationId,
    },
    select: {
      id: true,
      userId: true,
      role: true,
    },
  });
}

export async function countOrganizationOwners(organizationId: string) {
  return prisma.member.count({
    where: {
      organizationId,
      role: MembershipRole.owner,
    },
  });
}

/** Effective org role for manage UI and member mutations (platform admin → owner). */
export async function getActorOrganizationRoleForManage(input: {
  actorUserId: string;
  organizationId: string;
}): Promise<MembershipRole | null> {
  if (await isPlatformAdmin(input.actorUserId)) {
    return MembershipRole.owner;
  }

  return getUserOrganizationRole({
    userId: input.actorUserId,
    organizationId: input.organizationId,
  });
}

export async function canActorRemoveMember(input: {
  actorUserId: string;
  memberUserId: string;
}) {
  if (input.actorUserId !== input.memberUserId) {
    return true;
  }

  return isPlatformAdmin(input.actorUserId);
}

/** Whether the actor may change a member's role to `role` or modify a member with `role`. */
export function canActorModifyMemberRole(input: {
  actorRole: MembershipRole;
  role: MembershipRole;
}) {
  if (input.role === MembershipRole.owner) {
    return input.actorRole === MembershipRole.owner;
  }

  return (
    input.actorRole === MembershipRole.owner ||
    input.actorRole === MembershipRole.admin
  );
}
