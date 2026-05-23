"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";

type ManageTabsNavProps = {
  organizationId: string;
};

type TabKey = "members" | "teams" | "invitations" | "notifications";

function getActiveTab(pathname: string): TabKey {
  if (pathname.includes("/manage/teams")) {
    return "teams";
  }

  if (pathname.includes("/manage/invitations")) {
    return "invitations";
  }

  if (pathname.includes("/manage/notifications")) {
    return "notifications";
  }

  return "members";
}

export function ManageTabsNav({ organizationId }: ManageTabsNavProps) {
  const pathname = usePathname();
  const activeTab = getActiveTab(pathname);

  const tabs = [
    {
      key: "members" as const,
      label: dashboardNavLabels.manageTabs.members,
      href: dashboardRoutes.organizationMembers(organizationId),
    },
    {
      key: "teams" as const,
      label: dashboardNavLabels.manageTabs.teams,
      href: dashboardRoutes.organizationTeams(organizationId),
    },
    {
      key: "invitations" as const,
      label: dashboardNavLabels.manageTabs.invitations,
      href: dashboardRoutes.organizationInvitations(organizationId),
    },
    {
      key: "notifications" as const,
      label: dashboardNavLabels.manageTabs.notifications,
      href: dashboardRoutes.organizationNotifications(organizationId),
    },
  ];

  return (
    <Tabs value={activeTab} onValueChange={() => undefined} className="gap-0">
      <TabsList variant="line">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.key}
            value={tab.key}
            nativeButton={false}
            render={<Link href={tab.href} />}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
