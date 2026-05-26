import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BellIcon, Building2Icon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { RoleBadge } from "@/components/badge/role-badge";
import { DashboardViewNavList } from "@/app/dashboard/(user)/components/view-profile/dashboard-view-nav-list";
import { DashboardViewPageHeader } from "@/app/dashboard/(user)/components/view-profile/dashboard-view-page-header";
import { DashboardViewSection } from "@/app/dashboard/(user)/components/view-profile/dashboard-view-section";
import { StatCard, StatCardFallback, StatGrid } from "@/components/stat-card";
import {
  DashboardPageTitleFallback,
  DashboardTableCardFallback,
} from "@/app/dashboard/components/dashboard-page-shell/dashboard-page-fallbacks";
import { DashboardPageShell } from "@/app/dashboard/components/dashboard-page-shell/dashboard-page-shell";
import {
  getUserProfilePageData,
  type UserProfilePageData,
} from "@/app/dashboard/(user)/lib/get-user-profile-page";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import { requireAuthSession } from "@/lib/auth/session";

export default function UserDashboardHomePage() {
  return (
    <DashboardPageShell className="gap-8">
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
      <StatGrid columns={3}>
        <StatCardFallback />
        <StatCardFallback />
        <StatCardFallback />
      </StatGrid>
      <div className="grid gap-8 lg:grid-cols-2">
        <DashboardTableCardFallback />
        <DashboardTableCardFallback />
      </div>
    </>
  );
}

async function UserProfileHomeContent() {
  const userId = (await requireAuthSession()).user.id;
  const data = await getUserProfilePageData(userId);

  if (!data) {
    notFound();
  }

  const labels = dashboardNavLabels.viewProfile;

  return (
    <>
      <DashboardViewPageHeader
        eyebrow={labels.homeEyebrow}
        title={labels.homeTitle}
        description={labels.homeDescription}
        meta={
          <>
            <span className="font-medium text-foreground">
              {data.user.name}
            </span>
            <span aria-hidden>·</span>
            <span className="truncate">{data.user.email}</span>
          </>
        }
        actions={
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href={dashboardRoutes.account()} />}
          >
            Account settings
          </Button>
        }
      />

      <StatGrid columns={3}>
        <StatCard
          label={labels.organizations}
          value={data.organizationCount}
          icon={Building2Icon}
        />
        <StatCard
          label={labels.teams}
          value={data.teamCount}
          icon={UsersIcon}
        />
        <StatCard
          label={labels.unreadNotifications}
          value={data.directUnreadCount}
          icon={BellIcon}
          action={{
            href: dashboardRoutes.userNotifications(),
            label: "View notifications",
          }}
        />
      </StatGrid>

      <div className="grid gap-8 lg:grid-cols-2">
        <UserProfileOrganizationsSection data={data} />
        <UserProfileTeamsSection data={data} />
      </div>
    </>
  );
}

function UserProfileOrganizationsSection({
  data,
}: {
  data: UserProfilePageData;
}) {
  const labels = dashboardNavLabels.viewProfile;

  return (
    <DashboardViewSection
      title={labels.organizations}
      description={labels.organizationsDescription}
    >
      {data.memberships.length ? (
        <DashboardViewNavList
          icon={Building2Icon}
          items={data.memberships.map((membership) => ({
            id: membership.id,
            href: dashboardRoutes.organizationRoot(membership.organization.id),
            title: membership.organization.name,
            description: labels.openOrganization,
            trailing: <RoleBadge role={membership.role} />,
          }))}
        />
      ) : (
        <Empty className="rounded-lg border border-dashed bg-muted/30">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Building2Icon />
            </EmptyMedia>
            <EmptyTitle>{labels.noOrganizations}</EmptyTitle>
            <EmptyDescription>
              {labels.noOrganizationsDescription}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </DashboardViewSection>
  );
}

function UserProfileTeamsSection({ data }: { data: UserProfilePageData }) {
  const labels = dashboardNavLabels.viewProfile;

  return (
    <DashboardViewSection
      title={labels.yourTeams}
      description={labels.yourTeamsDescription}
    >
      {data.teamMemberships.length ? (
        <DashboardViewNavList
          icon={UsersIcon}
          items={data.teamMemberships.map((membership) => ({
            id: `${membership.organizationId}:${membership.teamId}`,
            href: dashboardRoutes.organizationTeamProfile(
              membership.organizationId,
              membership.teamId,
            ),
            title: membership.teamName,
            description: membership.organizationName,
          }))}
        />
      ) : (
        <Empty className="rounded-lg border border-dashed bg-muted/30">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UsersIcon />
            </EmptyMedia>
            <EmptyTitle>{labels.noTeams}</EmptyTitle>
            <EmptyDescription>{labels.noTeamsDescription}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </DashboardViewSection>
  );
}
