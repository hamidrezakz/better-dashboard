import { Suspense } from "react";
import { DashboardPageShell } from "@/app/dashboard/components/dashboard-page-shell/dashboard-page-shell";
import { AccountTabsNav } from "@/app/dashboard/(user)/account/components/account-tabs-nav";
import { AccountSectionCardFallback } from "@/app/dashboard/(user)/account/components/account-section-card";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";

type AccountLayoutProps = {
  children: React.ReactNode;
};

export default function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <DashboardPageShell>
      <h1 className="w-full max-w-xl text-base font-semibold">
        {dashboardNavLabels.breadcrumbSegments.account}
      </h1>

      <div className="w-full max-w-xl">
        <AccountTabsNav />
      </div>

      <div className="w-full max-w-xl">
        <Suspense fallback={<AccountSectionCardFallback />}>
          {children}
        </Suspense>
      </div>
    </DashboardPageShell>
  );
}
