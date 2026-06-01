import { Suspense } from "react";
import { AdminOrganizationManagementPanel } from "@/app/dashboard/admin/organizations/components/admin-organization-management-panel";
import {
  getAdminOrganizationsPage,
  parseAdminOrganizationsPageQuery,
} from "@/app/dashboard/admin/organizations/lib/get-admin-organizations-page";
import { DashboardTableCardFallback } from "@/app/dashboard/components/dashboard-page-shell/dashboard-page-fallbacks";

type AdminOrganizationsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function AdminOrganizationsPage(
  props: AdminOrganizationsPageProps,
) {
  return (
    <Suspense fallback={<DashboardTableCardFallback />}>
      <AdminOrganizationsPageContent {...props} />
    </Suspense>
  );
}

async function AdminOrganizationsPageContent({
  searchParams,
}: AdminOrganizationsPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = parseAdminOrganizationsPageQuery(resolvedSearchParams);
  const data = await getAdminOrganizationsPage(query);

  return (
    <AdminOrganizationManagementPanel
      organizations={data.organizations}
      page={data.page}
      pageSize={data.pageSize}
      totalCount={data.totalCount}
      q={data.q}
    />
  );
}
