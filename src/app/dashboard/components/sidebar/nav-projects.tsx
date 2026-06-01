"use client";

import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type DashboardNavProjectsProps = {
  projects: {
    name: string;
    url: string;
    icon: React.ReactNode;
  }[];
};

export function DashboardNavProjects({ projects }: DashboardNavProjectsProps) {
  if (!projects.length) {
    return null;
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>پروژه‌ها</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((project) => (
          <SidebarMenuItem key={project.name}>
            <SidebarMenuButton render={<Link href={project.url} />}>
              {project.icon}
              <span>{project.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
