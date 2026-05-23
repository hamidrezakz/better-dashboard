import { DashboardHeaderFallback } from "@/app/dashboard/components/dashboard-header-fallback";
import { DashboardSidebarFallback } from "@/app/dashboard/components/sidebar/dashboard-sidebar-fallback";
import { LoadingFallback } from "@/components/loading-fallback";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export function DashboardLayoutFallback() {
  return (
    <SidebarProvider>
      <DashboardSidebarFallback />
      <SidebarInset className="flex min-h-svh flex-col">
        <DashboardHeaderFallback />
        <LoadingFallback className="flex-1" />
      </SidebarInset>
    </SidebarProvider>
  );
}

export function DashboardPageFallback() {
  return <LoadingFallback className="flex-1 min-h-0" />;
}
