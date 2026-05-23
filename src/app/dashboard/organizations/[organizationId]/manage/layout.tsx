import { Suspense } from "react";
import { LoadingFallback } from "@/components/loading-fallback";
import { DashboardPageShell } from "@/app/dashboard/components/dashboard-page-shell/dashboard-page-shell";
import { requireOrganizationManageAccess } from "@/app/dashboard/lib/dashboard-access";
import { ManageTabsNav } from "@/app/dashboard/organizations/[organizationId]/manage/components/manage-tabs-nav";

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
  await requireOrganizationManageAccess(organizationId);

  return (
    <DashboardPageShell>
      <ManageTabsNav organizationId={organizationId} />

      <Suspense fallback={<LoadingFallback className="min-h-[12vh]" />}>
        {children}
      </Suspense>
    </DashboardPageShell>
  );
}
