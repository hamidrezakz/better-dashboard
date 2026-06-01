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
import type { SidebarNavigationGroupId } from "@/app/dashboard/lib/sidebar/sidebar-types";

type DashboardNavMainProps = {
  groups: {
    id: SidebarNavigationGroupId;
    items: {
      title: string;
      url: string;
      icon: React.ReactNode;
      items?: {
        title: string;
        url: string;
      }[];
    }[];
  }[];
};

function getGroupLabel(id: SidebarNavigationGroupId): string | undefined {
  switch (id) {
    case "home":
      return undefined;
    case "organization":
      return dashboardNavLabels.sidebar.groupOrganization;
    case "platform":
      return dashboardNavLabels.sidebar.groupPlatform;
    case "personal":
      return undefined;
    default:
      return undefined;
  }
}

export function DashboardNavMain({ groups }: DashboardNavMainProps) {
  return (
    <>
      {groups.map((group) => {
        const label = getGroupLabel(group.id);

        return (
          <SidebarGroup key={group.id} className="mt-2">
            {label ? <SidebarGroupLabel>{label}</SidebarGroupLabel> : null}
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={`${group.id}-${item.url}`}>
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
                          <SidebarMenuSubButton
                            render={<Link href={subItem.url} />}
                          >
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
      })}
    </>
  );
}
