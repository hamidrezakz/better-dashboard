import { cacheLife, cacheTag } from "next/cache";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import { getOrganizationTeamInOrg } from "@/app/dashboard/organizations/[organizationId]/lib/get-organization-team-in-org";
import { getUserOrganizationRole } from "@/app/dashboard/lib/dashboard-access";
import { prisma } from "@/lib/prisma";

export async function getOrganizationTeamProfileBase(
  organizationId: string,
  teamId: string,
) {
  "use cache";

  cacheLife("minutes");
  cacheTag(
    dashboardCacheTags.organizationTeamProfileById(organizationId, teamId),
  );

  const [team, organization] = await Promise.all([
    getOrganizationTeamInOrg({
      organizationId,
      teamId,
    }),
    prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  if (!team || !organization) {
    return null;
  }

  return {
    team: {
      id: team.id,
      name: team.name,
      createdAt: team.createdAt.toISOString(),
      memberCount: team._count.teammembers,
    },
    organization,
  };
}

export async function getOrganizationTeamProfileViewerContext(input: {
  organizationId: string;
  teamId: string;
  userId: string;
}) {
  const [viewerTeamMembership, viewerRole] = await Promise.all([
    prisma.teamMember.findFirst({
      where: {
        teamId: input.teamId,
        userId: input.userId,
      },
      select: {
        createdAt: true,
      },
    }),
    getUserOrganizationRole({
      userId: input.userId,
      organizationId: input.organizationId,
    }),
  ]);

  return {
    viewerTeamMembership: viewerTeamMembership
      ? {
          joinedAt: viewerTeamMembership.createdAt?.toISOString() ?? null,
        }
      : null,
    viewerRole,
  };
}

export async function getOrganizationTeamProfilePage(input: {
  organizationId: string;
  teamId: string;
  userId: string;
}) {
  const base = await getOrganizationTeamProfileBase(
    input.organizationId,
    input.teamId,
  );

  if (!base) {
    return null;
  }

  const viewer = await getOrganizationTeamProfileViewerContext(input);

  return {
    ...base,
    ...viewer,
  };
}

export type OrganizationTeamProfilePageData = NonNullable<
  Awaited<ReturnType<typeof getOrganizationTeamProfilePage>>
>;
