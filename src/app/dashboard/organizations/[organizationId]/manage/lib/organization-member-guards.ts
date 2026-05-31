import type { MembershipRole } from "@/generated/prisma/enums";
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
      role: "OWNER",
    },
  });
}

export async function getActorOrganizationRole(input: {
  actorUserId: string;
  organizationId: string;
}): Promise<MembershipRole | null> {
  const member = await prisma.member.findFirst({
    where: {
      organizationId: input.organizationId,
      userId: input.actorUserId,
    },
    select: {
      role: true,
    },
  });

  return member?.role ?? null;
}

/** Effective org role for manage UI and member mutations (platform admin → OWNER). */
export async function getActorOrganizationRoleForManage(input: {
  actorUserId: string;
  organizationId: string;
}): Promise<MembershipRole | null> {
  if (await isPlatformAdmin(input.actorUserId)) {
    return "OWNER";
  }

  return getActorOrganizationRole(input);
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

export function canActorAssignRole(input: {
  actorRole: MembershipRole;
  nextRole: MembershipRole;
}) {
  if (input.nextRole === "OWNER") {
    return input.actorRole === "OWNER";
  }

  return input.actorRole === "OWNER" || input.actorRole === "ADMIN";
}

export function canActorChangeMemberRole(input: {
  actorRole: MembershipRole;
  targetRole: MembershipRole;
}) {
  if (input.targetRole === "OWNER") {
    return input.actorRole === "OWNER";
  }

  return input.actorRole === "OWNER" || input.actorRole === "ADMIN";
}
