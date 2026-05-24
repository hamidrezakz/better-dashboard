import { Suspense } from "react";
import { notFound } from "next/navigation";
import { DashboardTableCardFallback } from "@/app/dashboard/components/dashboard-page-shell/dashboard-page-fallbacks";
import { TeamMemberManagementPanel } from "@/app/dashboard/organizations/[organizationId]/manage/teams/[teamId]/members/components/team-member-management-panel";
import {
  getOrganizationTeamMembersPage,
  parseOrganizationTeamMembersPageQuery,
} from "@/app/dashboard/organizations/[organizationId]/manage/teams/[teamId]/members/lib/get-organization-team-members-page";

type OrganizationTeamMembersPageProps = {
  params: Promise<{
    organizationId: string;
    teamId: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function OrganizationTeamMembersPage(
  props: OrganizationTeamMembersPageProps,
) {
  return (
    <Suspense fallback={<DashboardTableCardFallback />}>
      <OrganizationTeamMembersPageContent {...props} />
    </Suspense>
  );
}

async function OrganizationTeamMembersPageContent({
  params,
  searchParams,
}: OrganizationTeamMembersPageProps) {
  const { organizationId, teamId } = await params;
  const resolvedSearchParams = await searchParams;
  const query = parseOrganizationTeamMembersPageQuery(resolvedSearchParams);
  const data = await getOrganizationTeamMembersPage({
    organizationId,
    teamId,
    query,
  });

  if (!data) {
    notFound();
  }

  return (
    <TeamMemberManagementPanel
      organizationId={organizationId}
      teamId={teamId}
      teamName={data.team.name}
      members={data.members}
      page={data.page}
      pageSize={data.pageSize}
      totalCount={data.totalCount}
    />
  );
}
