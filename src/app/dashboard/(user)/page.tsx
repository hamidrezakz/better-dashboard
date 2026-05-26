import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BellIcon, Building2Icon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoleBadge } from "@/components/badge/role-badge";
import {
  DashboardPageTitleFallback,
  DashboardStatCardFallback,
  DashboardTableCardFallback,
} from "@/app/dashboard/components/dashboard-page-shell/dashboard-page-fallbacks";
import { DashboardPageShell } from "@/app/dashboard/components/dashboard-page-shell/dashboard-page-shell";
import {
  getUserProfilePageData,
  type UserProfilePageData,
} from "@/app/dashboard/(user)/lib/get-user-profile-page";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import { requireAuthSession } from "@/lib/auth/session";

export default function UserDashboardHomePage() {
  return (
    <DashboardPageShell>
      <Suspense fallback={<UserProfileHomeFallback />}>
        <UserProfileHomeContent />
      </Suspense>
    </DashboardPageShell>
  );
}

function UserProfileHomeFallback() {
  return (
    <>
      <DashboardPageTitleFallback />
      <div className="grid gap-4 md:grid-cols-3">
        <DashboardStatCardFallback />
        <DashboardStatCardFallback />
        <DashboardStatCardFallback />
      </div>
      <DashboardTableCardFallback />
    </>
  );
}

async function UserProfileHomeContent() {
  const userId = (await requireAuthSession()).user.id;
  const data = await getUserProfilePageData(userId);

  if (!data) {
    notFound();
  }

  return (
    <>
      <UserProfileHeader data={data} />
      <div className="grid gap-4 md:grid-cols-3">
        <UserProfileOrganizationStat data={data} />
        <UserProfileTeamStat data={data} />
        <UserProfileNotificationsStat data={data} />
      </div>
      <UserProfileMembershipsCard data={data} />
    </>
  );
}

function UserProfileHeader({ data }: { data: UserProfilePageData }) {
  return (
    <div>
      <h1 className="text-base font-semibold">{data.user.name}</h1>
    </div>
  );
}

function UserProfileOrganizationStat({ data }: { data: UserProfilePageData }) {
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

function UserProfileTeamStat({ data }: { data: UserProfilePageData }) {
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

function UserProfileNotificationsStat({ data }: { data: UserProfilePageData }) {
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
          nativeButton={false}
          render={<Link href={dashboardRoutes.userNotifications()} />}
        >
          View
        </Button>
      </CardContent>
    </Card>
  );
}

function UserProfileMembershipsCard({ data }: { data: UserProfilePageData }) {
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
                nativeButton={false}
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
