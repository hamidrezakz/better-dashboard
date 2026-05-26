import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Building2Icon, UsersIcon } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { DashboardViewNavList } from "@/app/dashboard/(user)/components/view-profile/dashboard-view-nav-list";
import { DashboardViewSection } from "@/app/dashboard/(user)/components/view-profile/dashboard-view-section";
import { OrganizationProfileHeaderPanel } from "@/app/dashboard/organizations/[organizationId]/components/organization-profile-header-panel";
import { StatCard, StatCardFallback, StatGrid } from "@/components/stat-card";
import {
  DashboardPageTitleFallback,
  DashboardTableCardFallback,
} from "@/app/dashboard/components/dashboard-page-shell/dashboard-page-fallbacks";
import { DashboardPageShell } from "@/app/dashboard/components/dashboard-page-shell/dashboard-page-shell";
import {
  getOrganizationProfilePage,
  type OrganizationProfilePageData,
} from "@/app/dashboard/organizations/[organizationId]/lib/get-organization-profile-page";
import {
  isOrganizationManagerRole,
  requireOrganizationAccess,
} from "@/app/dashboard/lib/dashboard-access";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import { requireAuthSession } from "@/lib/auth/session";

type OrganizationPageProps = {
  params: Promise<{
    organizationId: string;
  }>;
};

export default function OrganizationPage({ params }: OrganizationPageProps) {
  return (
    <DashboardPageShell className="gap-8">
      <Suspense fallback={<DashboardPageTitleFallback />}>
        <OrganizationPageHeader params={params} />
      </Suspense>

      <StatGrid columns={2}>
        <Suspense fallback={<StatCardFallback />}>
          <OrganizationMemberCountCard params={params} />
        </Suspense>
        <Suspense fallback={<StatCardFallback />}>
          <OrganizationTeamCountCard params={params} />
        </Suspense>
      </StatGrid>

      <Suspense fallback={<DashboardTableCardFallback />}>
        <OrganizationViewerTeamsCard params={params} />
      </Suspense>
    </DashboardPageShell>
  );
}

async function loadOrganizationProfile(
  params: OrganizationPageProps["params"],
) {
  const { organizationId } = await params;
  await requireOrganizationAccess(organizationId);
  const session = await requireAuthSession();
  const data = await getOrganizationProfilePage(
    organizationId,
    session.user.id,
  );

  if (!data) {
    notFound();
  }

  return data;
}

async function OrganizationPageHeader({ params }: OrganizationPageProps) {
  const data = await loadOrganizationProfile(params);
  const labels = dashboardNavLabels.viewProfile;
  const canManage = isOrganizationManagerRole(data.viewerMembership?.role);

  return (
    <header className="space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground">
        {labels.organizations}
      </p>
      <OrganizationProfileHeaderPanel
        organization={data.organization}
        viewerRole={data.viewerMembership?.role ?? null}
        canManage={canManage}
      />
    </header>
  );
}

async function OrganizationMemberCountCard({ params }: OrganizationPageProps) {
  const data = await loadOrganizationProfile(params);
  const labels = dashboardNavLabels.viewProfile;
  const canManage = isOrganizationManagerRole(data.viewerMembership?.role);

  return (
    <StatCard
      label={labels.members}
      value={data.memberCount}
      icon={UsersIcon}
      action={
        canManage
          ? {
              href: dashboardRoutes.organizationMembers(data.organization.id),
              label: labels.manageOrganization,
            }
          : undefined
      }
    />
  );
}

async function OrganizationTeamCountCard({ params }: OrganizationPageProps) {
  const data = await loadOrganizationProfile(params);
  const labels = dashboardNavLabels.viewProfile;
  const canManage = isOrganizationManagerRole(data.viewerMembership?.role);

  return (
    <StatCard
      label={labels.teams}
      value={data.teamCount}
      icon={Building2Icon}
      action={
        canManage
          ? {
              href: dashboardRoutes.organizationTeams(data.organization.id),
              label: labels.manageTeams,
            }
          : undefined
      }
    />
  );
}

async function OrganizationViewerTeamsCard({ params }: OrganizationPageProps) {
  const data = await loadOrganizationProfile(params);
  const labels = dashboardNavLabels.viewProfile;

  return (
    <DashboardViewSection title={labels.yourTeamsInOrganization}>
      {data.viewerTeams.length ? (
        <OrganizationViewerTeamsList
          organizationId={data.organization.id}
          teams={data.viewerTeams}
        />
      ) : (
        <Empty className="rounded-lg border border-dashed bg-muted/30">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UsersIcon />
            </EmptyMedia>
            <EmptyTitle>{labels.noTeamsInOrganization}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      )}
    </DashboardViewSection>
  );
}

function OrganizationViewerTeamsList({
  organizationId,
  teams,
}: {
  organizationId: string;
  teams: OrganizationProfilePageData["viewerTeams"];
}) {
  const labels = dashboardNavLabels.viewProfile;

  return (
    <DashboardViewNavList
      icon={UsersIcon}
      items={teams.map((team) => ({
        id: team.teamId,
        href: dashboardRoutes.organizationTeamProfile(
          organizationId,
          team.teamId,
        ),
        title: team.teamName,
      }))}
    />
  );
}
