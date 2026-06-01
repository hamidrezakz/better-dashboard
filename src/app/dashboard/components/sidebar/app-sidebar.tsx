"use client";

import * as React from "react";
import { DashboardNavMain } from "@/app/dashboard/components/sidebar/nav-main";
import { DashboardNavProjects } from "@/app/dashboard/components/sidebar/nav-projects";
import { DashboardNavUser } from "@/app/dashboard/components/sidebar/nav-user";
import { OrganizationSwitcher } from "@/app/dashboard/components/sidebar/organization-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  type DashboardSidebarConfig,
  type SidebarIconName,
} from "@/app/dashboard/lib/sidebar/sidebar-types";
import {
  BellIcon,
  Building2Icon,
  CircleUserIcon,
  FolderIcon,
  HomeIcon,
  LayoutDashboardIcon,
  Settings2Icon,
  UsersIcon,
} from "lucide-react";

const iconMap: Record<SidebarIconName, React.ReactNode> = {
  home: <HomeIcon className="size-4" />,
  "layout-dashboard": <LayoutDashboardIcon className="size-4" />,
  users: <UsersIcon className="size-4" />,
  user: <CircleUserIcon className="size-4" />,
  settings: <Settings2Icon className="size-4" />,
  folder: <FolderIcon className="size-4" />,
  bell: <BellIcon className="size-4" />,
  "building-2": <Building2Icon className="size-4" />,
};

type DashboardAppSidebarProps = {
  config: DashboardSidebarConfig;
} & React.ComponentProps<typeof Sidebar>;

export function DashboardAppSidebar({
  config,
  ...props
}: DashboardAppSidebarProps) {
  const navGroups = config.navGroups.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      icon: iconMap[item.icon],
    })),
  }));

  const projects = config.projects.map((project) => ({
    ...project,
    icon: iconMap[project.icon],
  }));

  return (
    <Sidebar side="right" {...props}>
      <SidebarHeader>
        <OrganizationSwitcher
          organizations={config.organizations}
          activeOrganizationId={config.activeOrganizationId}
        />
      </SidebarHeader>
      <SidebarContent>
        <DashboardNavMain groups={navGroups} />
        <DashboardNavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        <DashboardNavUser user={config.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
