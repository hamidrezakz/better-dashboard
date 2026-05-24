import { Suspense } from "react";
import { notFound } from "next/navigation";
import { LoadingFallback } from "@/components/loading-fallback";
import { TeamDetailPanel } from "@/app/dashboard/organizations/[organizationId]/manage/teams/[teamId]/components/team-detail-panel";
import { getOrganizationTeamPage } from "@/app/dashboard/organizations/[organizationId]/manage/teams/lib/get-organization-team-page";

type OrganizationTeamDetailPageProps = {
  params: Promise<{
    organizationId: string;
    teamId: string;
  }>;
};

export default function OrganizationTeamDetailPage(
  props: OrganizationTeamDetailPageProps,
) {
  return (
    <Suspense fallback={<LoadingFallback className="min-h-[20vh]" />}>
      <OrganizationTeamDetailPageContent {...props} />
    </Suspense>
  );
}

async function OrganizationTeamDetailPageContent({
  params,
}: OrganizationTeamDetailPageProps) {
  const { organizationId, teamId } = await params;
  const team = await getOrganizationTeamPage({ organizationId, teamId });

  if (!team) {
    notFound();
  }

  return <TeamDetailPanel organizationId={organizationId} team={team} />;
}
