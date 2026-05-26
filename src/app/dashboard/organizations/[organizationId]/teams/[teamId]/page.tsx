import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CalendarIcon, SettingsIcon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardViewPageHeader } from "@/app/dashboard/(user)/components/view-profile/dashboard-view-page-header";
import { StatCard, StatCardFallback, StatGrid } from "@/components/stat-card";
import { DashboardPageTitleFallback } from "@/app/dashboard/components/dashboard-page-shell/dashboard-page-fallbacks";
import { DashboardPageShell } from "@/app/dashboard/components/dashboard-page-shell/dashboard-page-shell";
import { getOrganizationTeamProfilePage } from "@/app/dashboard/organizations/[organizationId]/teams/[teamId]/lib/get-organization-team-profile-page";
import { isOrganizationManagerRole } from "@/app/dashboard/lib/dashboard-access";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import { requireAuthSession } from "@/lib/session";
import { formatDate } from "@/lib/format-date";

type OrganizationTeamProfilePageProps = {
  params: Promise<{
    organizationId: string;
    teamId: string;
  }>;
};

export default function OrganizationTeamProfilePage({
  params,
}: OrganizationTeamProfilePageProps) {
  return (
    <DashboardPageShell className="gap-8">
      <Suspense fallback={<DashboardPageTitleFallback />}>
        <OrganizationTeamProfileHeader params={params} />
      </Suspense>

      <StatGrid columns={2}>
        <Suspense fallback={<StatCardFallback />}>
          <OrganizationTeamMemberCountCard params={params} />
        </Suspense>
        <Suspense fallback={<StatCardFallback />}>
          <OrganizationTeamCreatedCard params={params} />
        </Suspense>
      </StatGrid>
    </DashboardPageShell>
  );
}

async function loadOrganizationTeamProfile(
  params: OrganizationTeamProfilePageProps["params"],
) {
  const { organizationId, teamId } = await params;
  const session = await requireAuthSession();
  const data = await getOrganizationTeamProfilePage({
    organizationId,
    teamId,
    userId: session.user.id,
  });

  if (!data) {
    notFound();
  }

  return data;
}

async function OrganizationTeamProfileHeader({
  params,
}: OrganizationTeamProfilePageProps) {
  const data = await loadOrganizationTeamProfile(params);
  const labels = dashboardNavLabels.viewProfile;
  const canManage = isOrganizationManagerRole(data.viewerRole);

  return (
    <DashboardViewPageHeader
      eyebrow={labels.teams}
      title={data.team.name}
      meta={
        <>
          <span>
            {labels.teamInOrganization}{" "}
            <Link
              href={dashboardRoutes.organizationRoot(data.organization.id)}
              className="font-medium text-foreground hover:underline"
            >
              {data.organization.name}
            </Link>
          </span>
          {data.viewerTeamMembership?.joinedAt ? (
            <>
              <span aria-hidden>·</span>
              <span>
                {labels.joined} {formatDate(data.viewerTeamMembership.joinedAt)}
              </span>
            </>
          ) : null}
        </>
      }
      actions={
        canManage ? (
          <Button
            size="sm"
            nativeButton={false}
            render={
              <Link
                href={dashboardRoutes.organizationTeam(
                  data.organization.id,
                  data.team.id,
                )}
              />
            }
          >
            <SettingsIcon className="size-4" aria-hidden />
            {labels.manageTeam}
          </Button>
        ) : undefined
      }
    />
  );
}

async function OrganizationTeamMemberCountCard({
  params,
}: OrganizationTeamProfilePageProps) {
  const data = await loadOrganizationTeamProfile(params);
  const labels = dashboardNavLabels.viewProfile;
  const canManage = isOrganizationManagerRole(data.viewerRole);

  return (
    <StatCard
      label={labels.members}
      value={data.team.memberCount}
      icon={UsersIcon}
      action={
        canManage
          ? {
              href: dashboardRoutes.organizationTeam(
                data.organization.id,
                data.team.id,
              ),
              label: labels.manageTeam,
            }
          : undefined
      }
    />
  );
}

async function OrganizationTeamCreatedCard({
  params,
}: OrganizationTeamProfilePageProps) {
  const data = await loadOrganizationTeamProfile(params);
  const labels = dashboardNavLabels.viewProfile;

  return (
    <StatCard
      label={labels.created}
      value={formatDate(data.team.createdAt)}
      icon={CalendarIcon}
    />
  );
}
