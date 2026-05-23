import { Suspense } from "react";
import { LoadingFallback } from "@/components/loading-fallback";
import { DashboardPageShell } from "@/app/dashboard/components/dashboard-page-shell/dashboard-page-shell";
import { AccountTabsNav } from "@/app/dashboard/(user)/account/components/account-tabs-nav";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";

type AccountLayoutProps = {
  children: React.ReactNode;
};

export default function AccountLayout({ children }: AccountLayoutProps) {
  const copy = dashboardNavLabels.accountPage;

  return (
    <DashboardPageShell>
      <div className="w-full max-w-xl space-y-1">
        <h1 className="text-base font-semibold">{copy.title}</h1>
        <p className="text-sm text-muted-foreground">{copy.description}</p>
      </div>

      <div className=" w-full max-w-xl">
        <AccountTabsNav />
      </div>

      <div className="w-full max-w-xl">
        <Suspense fallback={<LoadingFallback className="min-h-[12vh]" />}>
          {children}
        </Suspense>
      </div>
    </DashboardPageShell>
  );
}
