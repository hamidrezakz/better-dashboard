import { Suspense } from "react";
import { DashboardAppSidebar } from "@/app/dashboard/components/app-sidebar";
import { DashboardHeader } from "@/app/dashboard/components/dashboard-header";
import {
  DashboardLayoutFallback,
  DashboardPageFallback,
} from "@/app/dashboard/components/dashboard-layout-fallback";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { requireAuthSession } from "@/lib/auth-session";
import { getDashboardSidebarConfig } from "@/app/dashboard/lib/get-sidebar-config";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Suspense fallback={<DashboardLayoutFallback />}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}

async function DashboardLayoutContent({ children }: DashboardLayoutProps) {
  const session = await requireAuthSession();

  const sidebarConfig = await getDashboardSidebarConfig({
    userId: session.user.id,
    userName: session.user.name,
    userEmail: session.user.email,
    userAvatar: session.user.image ?? null,
    activeOrganizationId: session.session.activeOrganizationId ?? null,
  });

  return (
    <SidebarProvider>
      <DashboardAppSidebar config={sidebarConfig} />
      <SidebarInset className="flex min-h-svh flex-col">
        <DashboardHeader userId={session.user.id} />
        <div className="flex min-h-0 flex-1 flex-col">
          <Suspense fallback={<DashboardPageFallback />}>{children}</Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
