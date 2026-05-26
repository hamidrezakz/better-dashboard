"use server";

import type { Prisma } from "@/generated/prisma/client";
import { canManageOrganization } from "@/app/dashboard/lib/dashboard-access";
import { getOrganizationTeamInOrg } from "@/app/dashboard/organizations/[organizationId]/lib/get-organization-team-in-org";
import { requireAuthSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const MIN_QUERY_LENGTH = 2;
const MAX_RESULTS = 12;

type SearchUsersInput = {
  query: string;
  organizationId: string;
  teamId?: string;
  excludeUserIds?: string[];
};

function buildUserSearchWhere(
  query: string,
  input: SearchUsersInput,
): Prisma.UserWhereInput {
  const scopeFilters: Prisma.UserWhereInput[] = [
    {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
    },
    {
      members: { some: { organizationId: input.organizationId } },
    },
  ];

  if (input.teamId) {
    scopeFilters.push({
      teammembers: { some: { teamId: input.teamId } },
    });
  }

  if (input.excludeUserIds?.length) {
    scopeFilters.push({
      id: { notIn: input.excludeUserIds },
    });
  }

  return { AND: scopeFilters };
}

export async function searchUsersAction(input: SearchUsersInput) {
  const session = await requireAuthSession();
  const viewerUserId = session.user.id;

  const canManage = await canManageOrganization({
    viewerUserId,
    organizationId: input.organizationId,
  });

  if (!canManage) {
    return { users: [] };
  }

  if (input.teamId) {
    const team = await getOrganizationTeamInOrg({
      organizationId: input.organizationId,
      teamId: input.teamId,
    });

    if (!team) {
      return { users: [] };
    }
  }

  const query = input.query.trim();

  if (query.length < MIN_QUERY_LENGTH) {
    return { users: [] };
  }

  const users = await prisma.user.findMany({
    where: buildUserSearchWhere(query, input),
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
    orderBy: [{ name: "asc" }, { email: "asc" }],
    take: MAX_RESULTS,
  });

  return { users };
}

export type UserSearchOption = Awaited<
  ReturnType<typeof searchUsersAction>
>["users"][number];
