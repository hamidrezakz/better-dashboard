import type { Prisma } from "@/generated/prisma/client";

export function organizationInvitationsWhere(
  organizationId: string,
): Prisma.InvitationWhereInput {
  return {
    OR: [{ organizationId }, { team: { organizationId } }],
  };
}

export function organizationInvitationByIdWhere(input: {
  organizationId: string;
  invitationId: string;
}): Prisma.InvitationWhereInput {
  return {
    id: input.invitationId,
    ...organizationInvitationsWhere(input.organizationId),
  };
}
