"use client";

import type { ReactNode } from "react";
import { InvitationFormShellFooter } from "@/app/dashboard/organizations/[organizationId]/manage/invitations/components/invitation-form-shell-footer";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export type InvitationFormShellDrawerProps = {
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

export function InvitationFormShellDrawer({
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
}: InvitationFormShellDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="pb-6">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-2">{children}</div>
        <DrawerFooter className="flex-row gap-2">
          <InvitationFormShellFooter
            isEdit={isEdit}
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
