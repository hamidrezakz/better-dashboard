"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getActiveOrganizationManageTab,
  organizationManageNavItems,
} from "@/app/dashboard/lib/dashboard-manage-nav";

type ManageTabsNavProps = {
  organizationId: string;
};

export function ManageTabsNav({ organizationId }: ManageTabsNavProps) {
  const pathname = usePathname();
  const activeTab = getActiveOrganizationManageTab(pathname);

  return (
    <Tabs value={activeTab} onValueChange={() => undefined} className="gap-0">
      <TabsList variant="line">
        {organizationManageNavItems.map((tab) => (
          <TabsTrigger
            key={tab.key}
            value={tab.key}
            nativeButton={false}
            render={<Link href={tab.href(organizationId)} />}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
