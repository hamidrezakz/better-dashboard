"use client";

import type { ReactNode } from "react";
import { InvitationFormShellFooter } from "@/app/dashboard/organizations/[organizationId]/manage/invitations/components/invitation-form-shell-footer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type InvitationFormShellDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  isEdit: boolean;
  isPending: boolean;
  canSubmit: boolean;
  onClose: () => void;
  onSubmit: () => void;
  children: ReactNode;
};

export function InvitationFormShellDialog({
  open,
  onOpenChange,
  title,
  description,
  isEdit,
  isPending,
  canSubmit,
  onClose,
  onSubmit,
  children,
}: InvitationFormShellDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter className="justify-start!">
          <InvitationFormShellFooter
            isEdit={isEdit}
            isPending={isPending}
            canSubmit={canSubmit}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
