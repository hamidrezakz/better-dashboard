import { cacheLife, cacheTag } from "next/cache";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import { getOrganizationTeamInOrg } from "@/app/dashboard/organizations/[organizationId]/manage/lib/organization-team-access";
import { TEAM_MEMBERS_DEFAULT_PAGE_SIZE } from "@/app/dashboard/organizations/[organizationId]/manage/teams/[teamId]/members/lib/team-members-table-params";
import { prisma } from "@/lib/prisma";
import {
  clampDataTablePage,
  parseDataTablePage,
  parseDataTablePageSize,
} from "@/lib/data-table/search-params";

export type OrganizationTeamMemberItem = {
  id: string;
  userId: string;
  name: string;
  email: string;
  image: string | null;
  joinedAt: string;
};

export type OrganizationTeamMembersPageResult = {
  team: {
    id: string;
    name: string;
  };
  members: OrganizationTeamMemberItem[];
  totalCount: number;
  page: number;
  pageSize: number;
};

export function parseOrganizationTeamMembersPageQuery(
  searchParams: Record<string, string | string[] | undefined>,
): OrganizationTeamMembersPageQuery {
  return {
    page: parseDataTablePage(searchParams),
    pageSize: parseDataTablePageSize(searchParams, {
      defaultPageSize: TEAM_MEMBERS_DEFAULT_PAGE_SIZE,
    }),
  };
}

export type OrganizationTeamMembersPageQuery = {
  page: number;
  pageSize: number;
};

async function loadOrganizationTeamMembersPage(input: {
  organizationId: string;
  teamId: string;
  query: OrganizationTeamMembersPageQuery;
}): Promise<OrganizationTeamMembersPageResult | null> {
  const team = await getOrganizationTeamInOrg({
    organizationId: input.organizationId,
    teamId: input.teamId,
  });

  if (!team) {
    return null;
  }

  const totalCount = await prisma.teamMember.count({
    where: {
      teamId: input.teamId,
    },
  });

  const page = clampDataTablePage(
    input.query.page,
    totalCount,
    input.query.pageSize,
  );
  const skip = (page - 1) * input.query.pageSize;

  const members = await prisma.teamMember.findMany({
    where: {
      teamId: input.teamId,
    },
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
    take: input.query.pageSize,
  });

  return {
    team: {
      id: team.id,
      name: team.name,
    },
    members: members.map((member) => ({
      id: member.id,
      userId: member.user.id,
      name: member.user.name,
      email: member.user.email,
      image: member.user.image,
      joinedAt: (member.createdAt ?? new Date(0)).toISOString(),
    })),
    totalCount,
    page,
    pageSize: input.query.pageSize,
  };
}

export async function getOrganizationTeamMembersPage(input: {
  organizationId: string;
  teamId: string;
  query: OrganizationTeamMembersPageQuery;
}) {
  "use cache";

  cacheLife("minutes");
  cacheTag(dashboardCacheTags.organizationTeamsById(input.organizationId));
  cacheTag(dashboardCacheTags.organizationMembersById(input.organizationId));

  return loadOrganizationTeamMembersPage(input);
}
