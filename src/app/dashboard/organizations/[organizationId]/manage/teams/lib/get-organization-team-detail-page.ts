import { cacheLife, cacheTag } from "next/cache";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import { getOrganizationTeamInOrg } from "@/app/dashboard/organizations/[organizationId]/manage/teams/lib/organization-team-access";
import {
  TEAM_MEMBERS_DEFAULT_PAGE_SIZE,
  type OrganizationTeamMembersPageQuery,
} from "@/app/dashboard/organizations/[organizationId]/manage/teams/[teamId]/members/lib/team-members-table-params";
import type { OrganizationTeamMemberItem } from "@/app/dashboard/organizations/[organizationId]/manage/teams/[teamId]/members/lib/get-organization-team-members-page";
import { prisma } from "@/lib/prisma";
import {
  clampDataTablePage,
  parseDataTablePage,
  parseDataTablePageSize,
} from "@/lib/data-table/search-params";

export type OrganizationTeamDetailPageResult = {
  team: {
    id: string;
    name: string;
    memberCount: number;
    createdAt: string;
    updatedAt: string;
  };
  organizationMemberCount: number;
  members: OrganizationTeamMemberItem[];
  totalCount: number;
  page: number;
  pageSize: number;
};

export function parseOrganizationTeamDetailPageQuery(
  searchParams: Record<string, string | string[] | undefined>,
): OrganizationTeamMembersPageQuery {
  return {
    page: parseDataTablePage(searchParams),
    pageSize: parseDataTablePageSize(searchParams, {
      defaultPageSize: TEAM_MEMBERS_DEFAULT_PAGE_SIZE,
    }),
  };
}

async function loadOrganizationTeamDetailPage(input: {
  organizationId: string;
  teamId: string;
  query: OrganizationTeamMembersPageQuery;
}): Promise<OrganizationTeamDetailPageResult | null> {
  const team = await getOrganizationTeamInOrg({
    organizationId: input.organizationId,
    teamId: input.teamId,
  });

  if (!team) {
    return null;
  }

  const [organizationMemberCount, totalCount] = await Promise.all([
    prisma.member.count({
      where: { organizationId: input.organizationId },
    }),
    prisma.teamMember.count({
      where: { teamId: input.teamId },
    }),
  ]);

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
      memberCount: team._count.teammembers,
      createdAt: team.createdAt.toISOString(),
      updatedAt: (team.updatedAt ?? team.createdAt).toISOString(),
    },
    organizationMemberCount,
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

export async function getOrganizationTeamDetailPage(input: {
  organizationId: string;
  teamId: string;
  query: OrganizationTeamMembersPageQuery;
}) {
  "use cache";

  cacheLife("minutes");
  cacheTag(dashboardCacheTags.organizationTeamsById(input.organizationId));
  cacheTag(dashboardCacheTags.organizationMembersById(input.organizationId));

  return loadOrganizationTeamDetailPage(input);
}
