"use client";

import type { ReactNode } from "react";
import { NotificationFormShellFooter } from "@/app/dashboard/organizations/[organizationId]/manage/notifications/components/notification-form-shell-footer";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export type NotificationFormShellDrawerProps = {
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

export function NotificationFormShellDrawer({
  open,
  onOpenChange,
  title,
  description,
  isPending,
  canSubmit,
  onClose,
  onSubmit,
  children,
}: NotificationFormShellDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="pb-6">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-2">{children}</div>
        <DrawerFooter className="flex-row gap-2">
          <NotificationFormShellFooter
            isPending={isPending}
            canSubmit={canSubmit}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
