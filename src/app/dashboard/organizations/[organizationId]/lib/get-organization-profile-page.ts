import { cacheLife, cacheTag } from "next/cache";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import { prisma } from "@/lib/prisma";

export async function getOrganizationProfileBase(organizationId: string) {
  "use cache";

  cacheLife("minutes");
  cacheTag(dashboardCacheTags.organizationSummaryById(organizationId));

  const [organization, memberCount, teamCount] = await Promise.all([
    prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
      },
    }),
    prisma.member.count({
      where: {
        organizationId,
      },
    }),
    prisma.team.count({
      where: {
        organizationId,
      },
    }),
  ]);

  if (!organization) {
    return null;
  }

  return {
    organization,
    memberCount,
    teamCount,
  };
}

export async function getOrganizationProfileViewerContext(
  organizationId: string,
  userId: string,
) {
  const [viewerMembership, viewerTeams] = await Promise.all([
    prisma.member.findFirst({
      where: {
        organizationId,
        userId,
      },
      select: {
        role: true,
      },
    }),
    prisma.teamMember.findMany({
      where: {
        userId,
        team: {
          organizationId,
        },
      },
      select: {
        createdAt: true,
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
    }),
  ]);

  return {
    viewerMembership,
    viewerTeams: viewerTeams.map((membership) => ({
      teamId: membership.team.id,
      teamName: membership.team.name,
      joinedAt: membership.createdAt?.toISOString() ?? null,
    })),
  };
}

export async function getOrganizationProfilePage(
  organizationId: string,
  userId: string,
) {
  const base = await getOrganizationProfileBase(organizationId);

  if (!base) {
    return null;
  }

  const viewer = await getOrganizationProfileViewerContext(
    organizationId,
    userId,
  );

  return {
    ...base,
    ...viewer,
  };
}

export type OrganizationProfilePageData = NonNullable<
  Awaited<ReturnType<typeof getOrganizationProfilePage>>
>;
