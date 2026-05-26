import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Building2Icon, SettingsIcon, UsersIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getUserInitials } from "@/lib/user-profile/user-display";
import { DashboardViewPageHeader } from "@/app/dashboard/(user)/components/view-profile/dashboard-view-page-header";
import { UserProfileWorkspacesPanel } from "@/app/dashboard/(user)/components/view-profile/user-profile-workspaces-panel";
import { StatCard, StatCardFallback, StatGrid } from "@/components/stat-card";
import {
  DashboardPageTitleFallback,
  DashboardTableCardFallback,
} from "@/app/dashboard/components/dashboard-page-shell/dashboard-page-fallbacks";
import { DashboardPageShell } from "@/app/dashboard/components/dashboard-page-shell/dashboard-page-shell";
import { getUserProfilePageData } from "@/app/dashboard/(user)/lib/get-user-profile-page";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import { requireAuthSession } from "@/lib/session";

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
      <StatGrid columns={2}>
        <StatCardFallback />
        <StatCardFallback />
      </StatGrid>
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

  const labels = dashboardNavLabels.viewProfile;

  return (
    <>
      <DashboardViewPageHeader
        actions={
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href={dashboardRoutes.account()} />}
          >
            <SettingsIcon className="size-4" aria-hidden />
            {dashboardNavLabels.sidebar.account}
          </Button>
        }
        title={
          <span className="flex w-full min-w-0 items-center gap-x-3">
            <Avatar className="size-10 shrink-0 sm:size-12">
              <AvatarImage src={data.user.image ?? ""} alt={data.user.name} />
              <AvatarFallback>{getUserInitials(data.user.name)}</AvatarFallback>
            </Avatar>
            <span className="flex min-w-0 flex-1 items-baseline gap-x-1.5 overflow-hidden">
              <span className="truncate">{data.user.name}</span>
              <span className="shrink-0" aria-hidden>
                👋
              </span>
            </span>
          </span>
        }
      />

      <StatGrid columns={2}>
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
      </StatGrid>

      <UserProfileWorkspacesPanel data={data} />
    </>
  );
}
