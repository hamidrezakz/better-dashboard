import { prisma } from "@/lib/prisma";

export async function getUserNotificationScope(userId: string) {
  const [organizationMemberships, teamMemberships] = await Promise.all([
    prisma.member.findMany({
      where: { userId },
      select: { organizationId: true },
    }),
    prisma.teamMember.findMany({
      where: { userId },
      select: { teamId: true },
    }),
  ]);

  return {
    organizationIds: organizationMemberships.map(
      (membership) => membership.organizationId,
    ),
    teamIds: teamMemberships.map((membership) => membership.teamId),
  };
}

export function buildNotificationVisibilityFilters(input: {
  userId: string;
  organizationIds: string[];
  teamIds: string[];
}) {
  const filters: Array<Record<string, unknown>> = [{ userId: input.userId }];

  if (input.organizationIds.length) {
    filters.push({
      organizationId: {
        in: input.organizationIds,
      },
    });
  }

  if (input.teamIds.length) {
    filters.push({
      teamId: {
        in: input.teamIds,
      },
    });
  }

  return filters;
}

export function buildNotificationVisibilityWhere(input: {
  userId: string;
  organizationIds: string[];
  teamIds: string[];
  unreadOnly?: boolean;
}) {
  const visibilityFilters = buildNotificationVisibilityFilters({
    userId: input.userId,
    organizationIds: input.organizationIds,
    teamIds: input.teamIds,
  });

  const now = new Date();

  return {
    AND: [
      {
        OR: visibilityFilters,
      },
      {
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
      ...(input.unreadOnly ? [{ readAt: null }] : []),
    ],
  };
}
