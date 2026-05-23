"use client";

import type { ReactNode } from "react";
import { NotificationFormShellFooter } from "@/app/dashboard/organizations/[organizationId]/manage/notifications/components/notification-form-shell-footer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type NotificationFormShellDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  isPending: boolean;
  canSubmit: boolean;
  onClose: () => void;
  onSubmit: () => void;
  children: ReactNode;
};

export function NotificationFormShellDialog({
  open,
  onOpenChange,
  title,
  description,
  isPending,
  canSubmit,
  onClose,
  onSubmit,
  children,
}: NotificationFormShellDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter className="justify-start!">
          <NotificationFormShellFooter
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
