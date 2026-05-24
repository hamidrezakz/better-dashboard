"use client";

import { MoreHorizontalIcon, PencilLineIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { OrganizationTeamItem } from "@/app/dashboard/organizations/[organizationId]/manage/teams/lib/team-form-utils";

type TeamRowActionsMenuProps = {
  team: OrganizationTeamItem;
  disabled?: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export function TeamRowActionsMenu({
  team,
  disabled,
  onEdit,
  onDelete,
}: TeamRowActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button size="icon-sm" variant="ghost" />}
        aria-label={`Actions for ${team.name}`}
        onClick={(event) => event.stopPropagation()}
      >
        <MoreHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuItem
          onClick={(event) => {
            event.stopPropagation();
            onEdit();
          }}
        >
          <PencilLineIcon />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
        >
          <Trash2Icon />
          Delete team
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
