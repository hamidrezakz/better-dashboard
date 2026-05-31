import { Suspense } from "react";
import { getActorOrganizationRoleForManage } from "@/app/dashboard/organizations/[organizationId]/manage/lib/organization-member-guards";
import { requireAuthSession } from "@/lib/auth/session";
import { DashboardTableCardFallback } from "@/app/dashboard/components/dashboard-page-shell/dashboard-page-fallbacks";
import { MemberManagementPanel } from "@/app/dashboard/organizations/[organizationId]/manage/members/components/member-management-panel";
import {
  getOrganizationMembersPage,
  parseOrganizationMembersPageQuery,
} from "@/app/dashboard/organizations/[organizationId]/manage/members/lib/get-organization-members-page";
import { getOrganizationTeamsPage } from "@/app/dashboard/organizations/[organizationId]/manage/teams/lib/get-organization-teams-page";

type OrganizationMembersPageProps = {
  params: Promise<{
    organizationId: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function OrganizationMembersPage(
  props: OrganizationMembersPageProps,
) {
  return (
    <Suspense fallback={<DashboardTableCardFallback />}>
      <OrganizationMembersPageContent {...props} />
    </Suspense>
  );
}

async function OrganizationMembersPageContent({
  params,
  searchParams,
}: OrganizationMembersPageProps) {
  const { organizationId } = await params;
  const resolvedSearchParams = await searchParams;
  const query = parseOrganizationMembersPageQuery(resolvedSearchParams);
  const session = await requireAuthSession();
  const actorUserId = session.user.id;

  const [data, teamsData] = await Promise.all([
    getOrganizationMembersPage(organizationId, query),
    getOrganizationTeamsPage(organizationId),
  ]);

  const actorRole = await getActorOrganizationRoleForManage({
    actorUserId,
    organizationId,
  });

  return (
    <MemberManagementPanel
      organizationId={organizationId}
      members={data.members}
      teams={teamsData.teams.map((team) => ({ id: team.id, name: team.name }))}
      page={data.page}
      pageSize={data.pageSize}
      totalCount={data.totalCount}
      filter={data.filter}
      actorUserId={actorUserId}
      actorRole={actorRole}
    />
  );
}
