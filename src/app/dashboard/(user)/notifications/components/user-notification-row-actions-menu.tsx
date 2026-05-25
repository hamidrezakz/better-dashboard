"use client";

import { EyeIcon, MoreHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserNotificationRowActionsMenuProps = {
  notificationTitle: string;
  onView: () => void;
};

export function UserNotificationRowActionsMenu({
  notificationTitle,
  onView,
}: UserNotificationRowActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button size="icon-sm" variant="ghost" />}
        aria-label={`Actions for ${notificationTitle}`}
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
