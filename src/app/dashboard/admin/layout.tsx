import { Suspense } from "react";
import { AdminPageHeader } from "@/app/dashboard/admin/components/admin-page-header";
import { AdminTabsNav } from "@/app/dashboard/admin/components/admin-tabs-nav";
import { requirePlatformAdmin } from "@/app/dashboard/lib/dashboard-access";
import { DashboardTableCardFallback } from "@/app/dashboard/components/dashboard-page-shell/dashboard-page-fallbacks";
import { DashboardPageShell } from "@/app/dashboard/components/dashboard-page-shell/dashboard-page-shell";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  await requirePlatformAdmin();

  return (
    <DashboardPageShell>
      <AdminPageHeader />
      <AdminTabsNav />
      <Suspense fallback={<DashboardTableCardFallback />}>{children}</Suspense>
    </DashboardPageShell>
  );
}
