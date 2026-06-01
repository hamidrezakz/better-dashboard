"use client";

import {
  BanIcon,
  MoreHorizontalIcon,
  ShieldIcon,
  ShieldOffIcon,
} from "lucide-react";
import type { AdminUserItem } from "@/app/dashboard/admin/users/lib/get-admin-users-page";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AdminUserRowActionsMenuProps = {
  user: AdminUserItem;
  disabled?: boolean;
  isSelf: boolean;
  onChangeRole: () => void;
  onBan: () => void;
  onUnban: () => void;
};

export function AdminUserRowActionsMenu({
  user,
  disabled,
  isSelf,
  onChangeRole,
  onBan,
  onUnban,
}: AdminUserRowActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button size="icon-sm" variant="ghost" />}
        aria-label={`Actions for ${user.name}`}
      >
        <MoreHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuItem disabled={disabled} onClick={onChangeRole}>
          <ShieldIcon />
          {dashboardNavLabels.adminUserManage.changeRole}
        </DropdownMenuItem>
        {user.banned ? (
          <DropdownMenuItem disabled={disabled} onClick={onUnban}>
            <ShieldOffIcon />
            {dashboardNavLabels.adminUserManage.unbanUser}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            variant="destructive"
            disabled={disabled || isSelf}
            onClick={onBan}
          >
            <BanIcon />
            {dashboardNavLabels.adminUserManage.banUser}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
