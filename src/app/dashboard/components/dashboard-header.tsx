import { Suspense } from "react";
import { BellIcon } from "lucide-react";
import { DashboardBreadcrumbs } from "@/app/dashboard/components/dashboard-breadcrumbs";
import { HeaderNotificationsDropdown } from "@/app/dashboard/components/header-notifications-dropdown";
import { getHeaderNotificationsData } from "@/app/dashboard/lib/get-header-notifications";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

type DashboardHeaderProps = {
  userId: string;
};

async function NotificationsContent({ userId }: { userId: string }) {
  const notifications = await getHeaderNotificationsData(userId);

  return (
    <HeaderNotificationsDropdown
      userId={userId}
      items={notifications.items}
      hasMore={notifications.hasMore}
      unreadTotalCount={notifications.unreadTotalCount}
    />
  );
}

function NotificationsFallback() {
  return (
    <Button variant="ghost" size="icon-sm" aria-label="Notifications" disabled>
      <BellIcon />
    </Button>
  );
}

export function DashboardHeader({ userId }: DashboardHeaderProps) {
  return (
    <header className="flex h-12 mt-2 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center justify-between gap-2 px-4">
        <div className="flex min-w-0 items-center gap-2">
          <SidebarTrigger className="-ms-1" />
          <Separator
            orientation="vertical"
            className="me-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <DashboardBreadcrumbs />
        </div>

        <Suspense fallback={<NotificationsFallback />}>
          <NotificationsContent userId={userId} />
        </Suspense>
      </div>
    </header>
  );
}
