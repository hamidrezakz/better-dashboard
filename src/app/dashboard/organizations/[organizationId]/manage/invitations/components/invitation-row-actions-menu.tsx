"use client";

import {
  EyeIcon,
  MoreHorizontalIcon,
  PencilLineIcon,
  Trash2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { OrganizationInvitationItem } from "@/app/dashboard/organizations/[organizationId]/manage/invitations/lib/invitation-form-utils";

type InvitationRowActionsMenuProps = {
  invitation: OrganizationInvitationItem;
  disabled?: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function InvitationRowActionsMenu({
  invitation,
  disabled,
  onView,
  onEdit,
  onDelete,
}: InvitationRowActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button size="icon-sm" variant="ghost" />}
        aria-label="عملیات دعوت‌نامه"
      >
        <MoreHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuItem onClick={onView}>
          <EyeIcon />
          مشاهده
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>
          <PencilLineIcon />
          ویرایش
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          disabled={disabled}
          onClick={onDelete}
        >
          <Trash2Icon />
          حذف دعوت‌نامه
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
