"use client";

import {
  MoreHorizontalIcon,
  ShieldIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import type { OrganizationMemberItem } from "@/app/dashboard/organizations/[organizationId]/manage/members/lib/get-organization-members-page";

type MemberRowActionsMenuProps = {
  member: OrganizationMemberItem;
  disabled?: boolean;
  canRemove: boolean;
  onChangeRole: () => void;
  onManageTeams: () => void;
  onRemove: () => void;
};

export function MemberRowActionsMenu({
  member,
  disabled,
  canRemove,
  onChangeRole,
  onManageTeams,
  onRemove,
}: MemberRowActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button size="icon-sm" variant="ghost" />}
        aria-label={`Actions for ${member.name}`}
      >
        <MoreHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuItem disabled={disabled} onClick={onChangeRole}>
          <ShieldIcon />
          {dashboardNavLabels.memberManage.changeRole}
        </DropdownMenuItem>
        {/* TEAMS_SLICE: remove this menu item when trimming teams */}
        <DropdownMenuItem disabled={disabled} onClick={onManageTeams}>
          <UsersIcon />
          {dashboardNavLabels.memberManage.manageTeams}
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          disabled={disabled || !canRemove}
          onClick={onRemove}
        >
          <Trash2Icon />
          {dashboardNavLabels.memberManage.removeFromOrganization}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
