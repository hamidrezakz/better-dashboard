import { DashboardHeaderFallback } from "@/app/dashboard/components/shell/dashboard-header-fallback";
import { DashboardSidebarFallback } from "@/app/dashboard/components/sidebar/dashboard-sidebar-fallback";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

type LoadingFallbacksLayoutProps = {
  children: React.ReactNode;
};

export default function LoadingFallbacksLayout({
  children,
}: LoadingFallbacksLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardSidebarFallback />
      <SidebarInset className="flex min-h-svh flex-col">
        <DashboardHeaderFallback />
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
