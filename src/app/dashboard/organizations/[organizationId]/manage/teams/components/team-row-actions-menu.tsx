"use client";

import { EyeIcon, MoreHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TeamRowActionsMenuProps = {
  teamName: string;
  onView: () => void;
};

export function TeamRowActionsMenu({
  teamName,
  onView,
}: TeamRowActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button size="icon-sm" variant="ghost" />}
        aria-label={`Actions for ${teamName}`}
        onClick={(event) => event.stopPropagation()}
      >
        <MoreHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuItem
          onClick={(event) => {
            event.stopPropagation();
            onView();
          }}
        >
          <EyeIcon />
          View
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
