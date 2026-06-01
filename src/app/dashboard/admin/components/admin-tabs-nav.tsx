"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  adminNavItems,
  getActiveAdminTab,
} from "@/app/dashboard/admin/lib/admin-nav-items";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AdminTabsNav() {
  const pathname = usePathname();
  const activeTab = getActiveAdminTab(pathname);

  return (
    <Tabs value={activeTab} onValueChange={() => undefined} className="gap-0">
      <TabsList variant="line">
        {adminNavItems.map((tab) => (
          <TabsTrigger
            key={tab.key}
            value={tab.key}
            nativeButton={false}
            render={<Link href={tab.href()} />}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
