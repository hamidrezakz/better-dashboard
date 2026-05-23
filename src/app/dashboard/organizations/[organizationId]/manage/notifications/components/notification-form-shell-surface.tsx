"use client";

import type { ReactNode } from "react";
import { NotificationFormShellDialog } from "@/app/dashboard/organizations/[organizationId]/manage/notifications/components/notification-form-shell-dialog";
import { NotificationFormShellDrawer } from "@/app/dashboard/organizations/[organizationId]/manage/notifications/components/notification-form-shell-drawer";
import { useIsMobile } from "@/hooks/use-mobile";

export type NotificationFormShellSurfaceProps = {
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

export function NotificationFormShellSurface(
  props: NotificationFormShellSurfaceProps,
) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <NotificationFormShellDrawer {...props} />;
  }

  return <NotificationFormShellDialog {...props} />;
}
