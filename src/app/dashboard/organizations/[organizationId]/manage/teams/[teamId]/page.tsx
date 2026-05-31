import { Suspense } from "react";
import { notFound } from "next/navigation";
import { DashboardTeamDetailFallback } from "@/app/dashboard/components/dashboard-page-shell/dashboard-page-fallbacks";
import { TeamDetailPanel } from "@/app/dashboard/organizations/[organizationId]/manage/teams/[teamId]/components/team-detail-panel";
import {
  getOrganizationTeamDetailPage,
  parseOrganizationTeamDetailPageQuery,
} from "@/app/dashboard/organizations/[organizationId]/manage/teams/lib/get-organization-team-detail-page";

type OrganizationTeamDetailPageProps = {
  params: Promise<{
    organizationId: string;
    teamId: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function OrganizationTeamDetailPage(
  props: OrganizationTeamDetailPageProps,
) {
  return (
    <Suspense fallback={<DashboardTeamDetailFallback />}>
      <OrganizationTeamDetailPageContent {...props} />
    </Suspense>
  );
}

async function OrganizationTeamDetailPageContent({
  params,
  searchParams,
}: OrganizationTeamDetailPageProps) {
  const { organizationId, teamId } = await params;
  const resolvedSearchParams = await searchParams;
  const query = parseOrganizationTeamDetailPageQuery(resolvedSearchParams);
  const data = await getOrganizationTeamDetailPage({
    organizationId,
    teamId,
    query,
  });

  if (!data) {
    notFound();
  }

  return <TeamDetailPanel organizationId={organizationId} data={data} />;
}
