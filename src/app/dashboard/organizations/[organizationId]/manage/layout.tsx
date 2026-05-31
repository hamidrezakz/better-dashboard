import { Suspense } from "react";
import {
  DashboardPageTitleFallback,
  DashboardTableCardFallback,
} from "@/app/dashboard/components/dashboard-page-shell/dashboard-page-fallbacks";
import { DashboardPageShell } from "@/app/dashboard/components/dashboard-page-shell/dashboard-page-shell";
import {
  requireOrganizationAccess,
  requireOrganizationManageAccess,
} from "@/app/dashboard/lib/dashboard-access";
import { ManageTabsNav } from "@/app/dashboard/organizations/[organizationId]/manage/components/manage-tabs-nav";
import { OrganizationManageHeader } from "@/app/dashboard/organizations/[organizationId]/manage/components/organization-manage-header";

type OrganizationManageLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    organizationId: string;
  }>;
};

export default async function OrganizationManageLayout({
  children,
  params,
}: OrganizationManageLayoutProps) {
  const { organizationId } = await params;
  await requireOrganizationAccess(organizationId);
  await requireOrganizationManageAccess(organizationId);

  return (
    <DashboardPageShell>
      <Suspense fallback={<DashboardPageTitleFallback />}>
        <OrganizationManageHeader organizationId={organizationId} />
      </Suspense>

      <ManageTabsNav organizationId={organizationId} />

      <Suspense fallback={<DashboardTableCardFallback />}>{children}</Suspense>
    </DashboardPageShell>
  );
}
