"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { setActiveOrganizationAction } from "@/app/action/dashboard/components/set-active-organization-action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { type SidebarOrganizationItem } from "@/app/dashboard/lib/sidebar/sidebar-types";
import { Building2Icon, ChevronsUpDownIcon } from "lucide-react";

type OrganizationSwitcherProps = {
  organizations: SidebarOrganizationItem[];
  activeOrganizationId: string | null;
};

export function OrganizationSwitcher({
  organizations,
  activeOrganizationId,
}: OrganizationSwitcherProps) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const [isPending, startTransition] = React.useTransition();

  const activeOrganization = React.useMemo(
    () =>
      organizations.find(
        (organization) => organization.id === activeOrganizationId,
      ) ??
      organizations[0] ??
      null,
    [organizations, activeOrganizationId],
  );

  if (!activeOrganization) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Building2Icon className="size-4" />
            </div>
            <div className="grid flex-1 text-start text-sm leading-tight">
              <span className="truncate font-medium">No organization</span>
              <span className="truncate text-xs text-muted-foreground">
                Not a member of any organization
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const handleSwitch = (organizationId: string) => {
    if (organizationId === activeOrganizationId) {
      return;
    }

    startTransition(async () => {
      const result = await setActiveOrganizationAction({ organizationId });

      if (result.redirectTo) {
        router.replace(result.redirectTo);
        return;
      }

      router.refresh();
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
              />
            }
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Building2Icon className="size-4" />
            </div>
            <div className="grid flex-1 text-start text-sm leading-tight">
              <span className="truncate font-medium">
                {activeOrganization.name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                Active organization
              </span>
            </div>
            <ChevronsUpDownIcon className="ms-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Organizations
              </DropdownMenuLabel>
              {organizations.map((organization) => (
                <DropdownMenuItem
                  key={organization.id}
                  onClick={() => handleSwitch(organization.id)}
                  disabled={isPending}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <Building2Icon className="size-3.5" />
                  </div>
                  <span>{organization.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
