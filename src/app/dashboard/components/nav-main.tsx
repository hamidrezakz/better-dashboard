"use client";

import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";

type DashboardNavMainProps = {
  items: {
    title: string;
    url: string;
    icon: React.ReactNode;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
};

export function DashboardNavMain({ items }: DashboardNavMainProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{dashboardNavLabels.navMainGroup}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              render={<Link href={item.url} />}
              tooltip={item.title}
            >
              {item.icon}
              <span>{item.title}</span>
            </SidebarMenuButton>
            {item.items?.length ? (
              <SidebarMenuSub>
                {item.items.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton render={<Link href={subItem.url} />}>
                      <span>{subItem.title}</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            ) : null}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
