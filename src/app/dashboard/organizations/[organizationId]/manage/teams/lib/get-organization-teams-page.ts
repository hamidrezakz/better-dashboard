import { cacheLife, cacheTag } from "next/cache";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import type {
  OrganizationOutsiderTeamMemberItem,
  OrganizationTeamItem,
} from "@/app/dashboard/organizations/[organizationId]/manage/teams/lib/team-form-utils";
import { prisma } from "@/lib/prisma";

export type OrganizationTeamsPageResult = {
  teams: OrganizationTeamItem[];
  outsiderTeamMembers: OrganizationOutsiderTeamMemberItem[];
};

async function loadOrganizationTeamsPage(
  organizationId: string,
): Promise<OrganizationTeamsPageResult> {
  const [teams, organizationMembers] = await Promise.all([
    prisma.team.findMany({
      where: {
        organizationId,
      },
      include: {
        _count: {
          select: {
            teammembers: true,
          },
        },
        teammembers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.member.findMany({
      where: {
        organizationId,
      },
      select: {
        userId: true,
      },
    }),
  ]);

  const organizationMemberIds = new Set(
    organizationMembers.map((member) => member.userId),
  );

  const outsiderTeamMembers = teams.flatMap((team) =>
    team.teammembers
      .filter((member) => !organizationMemberIds.has(member.userId))
      .map((member) => ({
        id: member.id,
        teamName: team.name,
        userName: member.user.name,
        userEmail: member.user.email,
      })),
  );

  return {
    teams: teams.map((team) => ({
      id: team.id,
      name: team.name,
      memberCount: team._count.teammembers,
      createdAt: team.createdAt.toISOString(),
    })),
    outsiderTeamMembers,
  };
}

export async function getOrganizationTeamsPage(organizationId: string) {
  "use cache";

  cacheLife("minutes");
  cacheTag(dashboardCacheTags.organizationTeamsById(organizationId));

  return loadOrganizationTeamsPage(organizationId);
}
