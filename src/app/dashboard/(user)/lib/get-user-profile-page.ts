import { cacheLife, cacheTag } from "next/cache";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import { prisma } from "@/lib/prisma";

export async function getUserProfilePageData(userId: string) {
  "use cache";

  cacheLife("minutes");
  cacheTag(dashboardCacheTags.userProfileById(userId));

  const [user, memberships, teamMemberships, directUnreadCount] =
    await Promise.all([
      prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
        },
      }),
      prisma.member.findMany({
        where: {
          userId,
        },
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              logo: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.teamMember.findMany({
        where: {
          userId,
        },
        select: {
          createdAt: true,
          team: {
            select: {
              id: true,
              name: true,
              organization: {
                select: {
                  id: true,
                  name: true,
                  logo: true,
                },
              },
            },
          },
        },
        orderBy: {
          team: {
            name: "asc",
          },
        },
      }),
      prisma.notification.count({
        where: {
          userId,
          readAt: null,
        },
      }),
    ]);

  if (!user) {
    return null;
  }

  const teamMembershipList = teamMemberships.map((membership) => ({
    teamId: membership.team.id,
    teamName: membership.team.name,
    organizationId: membership.team.organization.id,
    organizationName: membership.team.organization.name,
    organizationLogo: membership.team.organization.logo,
    joinedAt: membership.createdAt?.toISOString() ?? null,
  }));

  const organizationIds = new Set([
    ...memberships.map((membership) => membership.organization.id),
    ...teamMembershipList.map((membership) => membership.organizationId),
  ]);

  return {
    user,
    memberships,
    organizationCount: organizationIds.size,
    teamMemberships: teamMembershipList,
    teamCount: teamMembershipList.length,
    directUnreadCount,
  };
}

export type UserProfilePageData = NonNullable<
  Awaited<ReturnType<typeof getUserProfilePageData>>
>;
