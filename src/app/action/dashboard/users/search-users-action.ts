"use server";

import type { Prisma } from "@/generated/prisma/client";
import { requireAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

const MIN_QUERY_LENGTH = 2;
const MAX_RESULTS = 12;

type SearchUsersInput = {
  query: string;
  organizationId?: string;
  teamId?: string;
};

function buildUserSearchWhere(
  query: string,
  input: SearchUsersInput,
): Prisma.UserWhereInput {
  const textFilter: Prisma.UserWhereInput = {
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
    ],
  };

  const scopeFilters: Prisma.UserWhereInput[] = [textFilter];

  if (input.teamId) {
    scopeFilters.push({
      teammembers: { some: { teamId: input.teamId } },
    });
  }

  if (input.organizationId) {
    scopeFilters.push({
      members: { some: { organizationId: input.organizationId } },
    });
  }

  return scopeFilters.length === 1 ? textFilter : { AND: scopeFilters };
}

export async function searchUsersAction(input: SearchUsersInput) {
  await requireAuthSession();

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
