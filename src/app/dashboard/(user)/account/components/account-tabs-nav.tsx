"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  accountNavItems,
  getActiveAccountTab,
} from "@/app/dashboard/lib/sidebar/account-nav-items";

export function AccountTabsNav() {
  const pathname = usePathname();
  const activeTab = getActiveAccountTab(pathname);

  return (
    <Tabs value={activeTab} onValueChange={() => undefined} className="gap-0">
      <TabsList variant="line">
        {accountNavItems.map((tab) => (
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
