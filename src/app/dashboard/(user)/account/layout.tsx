import { Suspense } from "react";
import { LoadingFallback } from "@/components/loading-fallback";
import { DashboardPageShell } from "@/app/dashboard/components/dashboard-page-shell/dashboard-page-shell";
import { AccountTabsNav } from "@/app/dashboard/(user)/account/components/account-tabs-nav";

type AccountLayoutProps = {
  children: React.ReactNode;
};

export default function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <DashboardPageShell>
      <div>
        <h1 className="text-base font-semibold">Account</h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile, password, and active sessions.
        </p>
      </div>

      <AccountTabsNav />

      <Suspense fallback={<LoadingFallback className="min-h-[12vh]" />}>
        {children}
      </Suspense>
    </DashboardPageShell>
  );
}
