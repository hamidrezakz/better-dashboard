"use client";

import { MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import type { OrganizationTeamMemberItem } from "@/app/dashboard/organizations/[organizationId]/manage/teams/[teamId]/members/lib/get-organization-team-members-page";

type TeamMemberRowActionsMenuProps = {
  member: OrganizationTeamMemberItem;
  disabled?: boolean;
  onRemove: () => void;
};

export function TeamMemberRowActionsMenu({
  member,
  disabled,
  onRemove,
}: TeamMemberRowActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button size="icon-sm" variant="ghost" />}
        aria-label={`Actions for ${member.name}`}
      >
        <MoreHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuItem
          variant="destructive"
          disabled={disabled}
          onClick={onRemove}
        >
          <Trash2Icon />
          {dashboardNavLabels.memberManage.removeFromTeam}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
