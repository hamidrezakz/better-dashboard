import { Suspense } from "react";
import { DashboardTableCardFallback } from "@/app/dashboard/components/dashboard-page-fallbacks";
import { InvitationManagementPanel } from "@/app/dashboard/organizations/[organizationId]/manage/invitations/components/invitation-management-panel";
import {
  getOrganizationInvitationsPage,
  parseOrganizationInvitationsPageQuery,
} from "@/app/dashboard/organizations/[organizationId]/manage/invitations/lib/get-organization-invitations-page";

type OrganizationInvitationsPageProps = {
  params: Promise<{
    organizationId: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function OrganizationInvitationsPage(
  props: OrganizationInvitationsPageProps,
) {
  return (
    <Suspense fallback={<DashboardTableCardFallback />}>
      <OrganizationInvitationsPageContent {...props} />
    </Suspense>
  );
}

async function OrganizationInvitationsPageContent({
  params,
  searchParams,
}: OrganizationInvitationsPageProps) {
  const { organizationId } = await params;
  const resolvedSearchParams = await searchParams;
  const query = parseOrganizationInvitationsPageQuery(resolvedSearchParams);
  const data = await getOrganizationInvitationsPage(organizationId, query);

  return (
    <InvitationManagementPanel
      organizationId={organizationId}
      teams={data.teams}
      invitations={data.invitations}
      page={data.page}
      pageSize={data.pageSize}
      totalCount={data.totalCount}
    />
  );
}
