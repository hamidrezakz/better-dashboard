import { Suspense } from "react";
import { DashboardTableCardFallback } from "@/app/dashboard/components/dashboard-page-fallbacks";
import { MembersTable } from "@/app/dashboard/organizations/[organizationId]/manage/members/components/members-table";
import {
  getOrganizationMembersPage,
  parseOrganizationMembersPageQuery,
} from "@/app/dashboard/organizations/[organizationId]/manage/members/lib/get-organization-members-page";

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
  const data = await getOrganizationMembersPage(organizationId, query);

  return (
    <MembersTable
      organizationId={organizationId}
      members={data.members}
      page={data.page}
      pageSize={data.pageSize}
      totalCount={data.totalCount}
      filter={data.filter}
    />
  );
}
