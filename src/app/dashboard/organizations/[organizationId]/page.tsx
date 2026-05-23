import Link from "next/link";
import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import { Building2Icon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoleBadge } from "@/components/globals-badge/role-badge";
import {
  DashboardPageTitleFallback,
  DashboardStatCardFallback,
} from "@/app/dashboard/components/dashboard-page-shell/dashboard-page-fallbacks";
import { DashboardPageShell } from "@/app/dashboard/components/dashboard-page-shell/dashboard-page-shell";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import { isOrganizationManagerRole } from "@/app/dashboard/lib/dashboard-access";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import { requireAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

type OrganizationPageProps = {
  params: Promise<{
    organizationId: string;
  }>;
};

async function getOrganizationSummary(organizationId: string, userId: string) {
  "use cache";

  cacheLife("minutes");
  cacheTag(dashboardCacheTags.organizationSummaryById(organizationId));

  const [organization, viewerMembership, memberCount, teamCount] =
    await Promise.all([
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
      prisma.member.findFirst({
        where: {
          organizationId,
          userId,
        },
        select: {
          role: true,
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
    viewerMembership,
    memberCount,
    teamCount,
  };
}

export default function OrganizationPage({ params }: OrganizationPageProps) {
  return (
    <DashboardPageShell>
      <Suspense fallback={<DashboardPageTitleFallback />}>
        <OrganizationPageHeader params={params} />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-2">
        <Suspense fallback={<DashboardStatCardFallback />}>
          <OrganizationMemberCountCard params={params} />
        </Suspense>
        <Suspense fallback={<DashboardStatCardFallback />}>
          <OrganizationTeamCountCard params={params} />
        </Suspense>
      </div>
    </DashboardPageShell>
  );
}

async function OrganizationPageHeader({ params }: OrganizationPageProps) {
  const { organizationId } = await params;
  const session = await requireAuthSession();
  const data = await getOrganizationSummary(organizationId, session.user.id);

  if (!data) {
    notFound();
  }

  const canManage = isOrganizationManagerRole(data.viewerMembership?.role);

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <h1 className="text-base font-semibold">{data.organization.name}</h1>
        {data.viewerMembership && (
          <RoleBadge role={data.viewerMembership.role} />
        )}
      </div>
      {canManage && (
        <Button
          size="sm"
          render={
            <Link
              href={dashboardRoutes.organizationMembers(data.organization.id)}
            />
          }
        >
          Manage
        </Button>
      )}
    </div>
  );
}

async function OrganizationMemberCountCard({ params }: OrganizationPageProps) {
  const { organizationId } = await params;
  const session = await requireAuthSession();
  const data = await getOrganizationSummary(organizationId, session.user.id);

  if (!data) {
    notFound();
  }

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <UsersIcon className="size-4" />
          Members
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{data.memberCount}</p>
      </CardContent>
    </Card>
  );
}

async function OrganizationTeamCountCard({ params }: OrganizationPageProps) {
  const { organizationId } = await params;
  const session = await requireAuthSession();
  const data = await getOrganizationSummary(organizationId, session.user.id);

  if (!data) {
    notFound();
  }

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Building2Icon className="size-4" />
          Teams
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{data.teamCount}</p>
      </CardContent>
    </Card>
  );
}
