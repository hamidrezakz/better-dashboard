import { cacheLife, cacheTag } from "next/cache";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import {
  MEMBERS_DEFAULT_PAGE_SIZE,
  parseMemberTableFilter,
  type MemberTableFilter,
} from "@/app/dashboard/organizations/[organizationId]/manage/members/lib/members-table-params";
import type { MembershipRole } from "@/generated/prisma/enums";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  clampDataTablePage,
  parseDataTableFilter,
  parseDataTablePage,
  parseDataTablePageSize,
} from "@/lib/data-table/search-params";

export type OrganizationMemberTeamItem = {
  id: string;
  name: string;
};

export type OrganizationMemberItem = {
  id: string;
  userId: string;
  name: string;
  email: string;
  image: string | null;
  role: MembershipRole;
  joinedAt: string;
  teams: OrganizationMemberTeamItem[];
};

export type OrganizationMembersPageQuery = {
  page: number;
  pageSize: number;
  filter: MemberTableFilter;
};

export type OrganizationMembersPageResult = {
  members: OrganizationMemberItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  filter: MemberTableFilter;
};

function buildMembersWhere(
  organizationId: string,
  filter: MemberTableFilter,
): Prisma.MemberWhereInput {
  const where: Prisma.MemberWhereInput = {
    organizationId,
  };

  if (filter === "managers") {
    where.role = { in: ["OWNER", "ADMIN"] };
  } else if (filter === "members") {
    where.role = "MEMBER";
  }

  return where;
}

export function parseOrganizationMembersPageQuery(
  searchParams: Record<string, string | string[] | undefined>,
): OrganizationMembersPageQuery {
  return {
    page: parseDataTablePage(searchParams),
    pageSize: parseDataTablePageSize(searchParams, {
      defaultPageSize: MEMBERS_DEFAULT_PAGE_SIZE,
    }),
    filter: parseMemberTableFilter(parseDataTableFilter(searchParams)),
  };
}

async function loadOrganizationMembersPage(
  organizationId: string,
  query: OrganizationMembersPageQuery,
): Promise<OrganizationMembersPageResult> {
  const where = buildMembersWhere(organizationId, query.filter);

  const totalCount = await prisma.member.count({ where });
  const page = clampDataTablePage(query.page, totalCount, query.pageSize);
  const skip = (page - 1) * query.pageSize;

  const members = await prisma.member.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take: query.pageSize,
  });

  const userIds = members.map((member) => member.userId);
  const teamsByUserId = new Map<string, OrganizationMemberTeamItem[]>();

  if (userIds.length > 0) {
    const teamMemberships = await prisma.teamMember.findMany({
      where: {
        userId: { in: userIds },
        team: {
          organizationId,
        },
      },
      select: {
        userId: true,
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        team: {
          name: "asc",
        },
      },
    });

    for (const membership of teamMemberships) {
      const current = teamsByUserId.get(membership.userId) ?? [];
      current.push({
        id: membership.team.id,
        name: membership.team.name,
      });
      teamsByUserId.set(membership.userId, current);
    }
  }

  return {
    members: members.map((member) => ({
      id: member.id,
      userId: member.userId,
      name: member.user.name,
      email: member.user.email,
      image: member.user.image,
      role: member.role,
      joinedAt: member.createdAt.toISOString(),
      teams: teamsByUserId.get(member.userId) ?? [],
    })),
    totalCount,
    page,
    pageSize: query.pageSize,
    filter: query.filter,
  };
}

export async function getOrganizationMembersPage(
  organizationId: string,
  query: OrganizationMembersPageQuery,
) {
  "use cache";

  cacheLife("minutes");
  cacheTag(dashboardCacheTags.organizationMembersById(organizationId));

  return loadOrganizationMembersPage(organizationId, query);
}
