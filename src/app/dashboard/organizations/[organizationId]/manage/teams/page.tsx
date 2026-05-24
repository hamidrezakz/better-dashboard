import { Suspense } from "react";
import { DashboardTableCardFallback } from "@/app/dashboard/components/dashboard-page-shell/dashboard-page-fallbacks";
import { TeamManagementPanel } from "@/app/dashboard/organizations/[organizationId]/manage/teams/components/team-management-panel";
import { getOrganizationTeamsPage } from "@/app/dashboard/organizations/[organizationId]/manage/teams/lib/get-organization-teams-page";

type OrganizationTeamsPageProps = {
  params: Promise<{
    organizationId: string;
  }>;
};

export default function OrganizationTeamsPage(
  props: OrganizationTeamsPageProps,
) {
  return (
    <Suspense fallback={<DashboardTableCardFallback />}>
      <OrganizationTeamsPageContent {...props} />
    </Suspense>
  );
}

async function OrganizationTeamsPageContent({
  params,
}: OrganizationTeamsPageProps) {
  const { organizationId } = await params;
  const data = await getOrganizationTeamsPage(organizationId);

  return (
    <TeamManagementPanel
      organizationId={organizationId}
      teams={data.teams}
      outsiderTeamMembers={data.outsiderTeamMembers}
    />
  );
}
