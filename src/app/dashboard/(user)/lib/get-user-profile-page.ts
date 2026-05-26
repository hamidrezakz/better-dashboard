import { cacheLife, cacheTag } from "next/cache";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import { prisma } from "@/lib/prisma";

export async function getUserProfilePageData(userId: string) {
  "use cache";

  cacheLife("minutes");
  cacheTag(dashboardCacheTags.userProfileById(userId));

  const [user, memberships, teamCount, directUnreadCount] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
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
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.teamMember.count({
      where: {
        userId,
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

  return {
    user,
    memberships,
    organizationCount: memberships.length,
    teamCount,
    directUnreadCount,
  };
}

export type UserProfilePageData = NonNullable<
  Awaited<ReturnType<typeof getUserProfilePageData>>
>;
