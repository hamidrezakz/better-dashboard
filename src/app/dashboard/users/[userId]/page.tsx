import Link from "next/link";
import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import { BellIcon, Building2Icon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoleBadge } from "@/components/globals-badge/role-badge";
import {
  DashboardPageTitleFallback,
  DashboardStatCardFallback,
  DashboardTableCardFallback,
} from "@/app/dashboard/components/dashboard-page-fallbacks";
import { DashboardPageShell } from "@/app/dashboard/components/dashboard-page-shell";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import { prisma } from "@/lib/prisma";

type UserProfilePageProps = {
  params: Promise<{
    userId: string;
  }>;
};

async function getUserProfileData(userId: string) {
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

export default function UserProfilePage({ params }: UserProfilePageProps) {
  return (
    <DashboardPageShell>
      <Suspense fallback={<DashboardPageTitleFallback />}>
        <UserProfileHeader params={params} />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-3">
        <Suspense fallback={<DashboardStatCardFallback />}>
          <UserProfileOrganizationStat params={params} />
        </Suspense>
        <Suspense fallback={<DashboardStatCardFallback />}>
          <UserProfileTeamStat params={params} />
        </Suspense>
        <Suspense fallback={<DashboardStatCardFallback />}>
          <UserProfileNotificationsStat params={params} />
        </Suspense>
      </div>

      <Suspense fallback={<DashboardTableCardFallback />}>
        <UserProfileMembershipsCard params={params} />
      </Suspense>
    </DashboardPageShell>
  );
}

async function UserProfileHeader({ params }: UserProfilePageProps) {
  const { userId } = await params;
  const data = await getUserProfileData(userId);

  if (!data) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-base font-semibold">{data.user.name}</h1>
      <p className="text-sm text-muted-foreground">{data.user.email}</p>
    </div>
  );
}

async function UserProfileOrganizationStat({ params }: UserProfilePageProps) {
  const { userId } = await params;
  const data = await getUserProfileData(userId);

  if (!data) {
    notFound();
  }

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Building2Icon className="size-4" />
          Organizations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{data.organizationCount}</p>
      </CardContent>
    </Card>
  );
}

async function UserProfileTeamStat({ params }: UserProfilePageProps) {
  const { userId } = await params;
  const data = await getUserProfileData(userId);

  if (!data) {
    notFound();
  }

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <UsersIcon className="size-4" />
          Teams
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{data.teamCount}</p>
      </CardContent>
    </Card>
  );
}

async function UserProfileNotificationsStat({ params }: UserProfilePageProps) {
  const { userId } = await params;
  const data = await getUserProfileData(userId);

  if (!data) {
    notFound();
  }

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <BellIcon className="size-4" />
          Unread notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-2">
        <p className="text-2xl font-semibold">{data.directUnreadCount}</p>
        <Button
          size="sm"
          variant="ghost"
          render={<Link href={dashboardRoutes.userNotifications(userId)} />}
        >
          View
        </Button>
      </CardContent>
    </Card>
  );
}

async function UserProfileMembershipsCard({ params }: UserProfilePageProps) {
  const { userId } = await params;
  const data = await getUserProfileData(userId);

  if (!data) {
    notFound();
  }

  if (!data.memberships.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organizations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {data.memberships.map((membership) => (
            <div
              key={membership.id}
              className="flex flex-wrap items-center justify-between gap-2 py-2.5 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {membership.organization.name}
                </span>
                <RoleBadge role={membership.role} />
              </div>
              <Button
                size="sm"
                variant="ghost"
                render={
                  <Link
                    href={dashboardRoutes.organizationRoot(
                      membership.organization.id,
                    )}
                  />
                }
              >
                View
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
