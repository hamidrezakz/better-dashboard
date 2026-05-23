"use client";

import * as React from "react";
import { logoutAction } from "@/app/action/dashboard/components/logout-action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { type DashboardSidebarConfig } from "@/app/dashboard/lib/sidebar-types";
import { ChevronsUpDownIcon, LogOutIcon, MoonIcon } from "lucide-react";
import { useTheme } from "next-themes";

type DashboardNavUserProps = {
  user: DashboardSidebarConfig["user"];
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) {
    return "US";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function DashboardNavUserThemeItem() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div
      role="group"
      aria-label="تم تاریک"
      className="relative flex min-h-7 items-center justify-between gap-2 rounded-md px-2 py-1 text-xs/relaxed select-none [&_svg]:size-3.5 [&_svg]:shrink-0"
    >
      <MoonIcon className="pointer-events-none" />
      <span className="flex-1">تم تاریک</span>
      <Switch
        size="sm"
        checked={isDark}
        disabled={!mounted}
        aria-label="تم تاریک"
        onCheckedChange={(checked) => {
          setTheme(checked ? "dark" : "light");
        }}
      />
    </div>
  );
}

export function DashboardNavUser({ user }: DashboardNavUserProps) {
  const { isMobile } = useSidebar();
  const [isPending, startTransition] = React.useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
            }
          >
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-start text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
            <ChevronsUpDownIcon className="ms-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-start text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DashboardNavUserThemeItem />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              disabled={isPending}
              onClick={handleLogout}
            >
              <LogOutIcon />
              {isPending ? "در حال خروج..." : "خروج از حساب"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
