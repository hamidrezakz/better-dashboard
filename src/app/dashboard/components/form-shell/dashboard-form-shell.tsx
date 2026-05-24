"use client";

import type { ReactNode } from "react";
import { DashboardFormShellDialog } from "@/app/dashboard/components/form-shell/dashboard-form-shell-dialog";
import { DashboardFormShellSheet } from "@/app/dashboard/components/form-shell/dashboard-form-shell-sheet";
import { useIsMobile } from "@/hooks/use-mobile";

export type DashboardFormShellProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  footer: ReactNode;
  children: ReactNode;
  contentClassName?: string;
};

export function DashboardFormShell({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
  contentClassName,
}: DashboardFormShellProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <DashboardFormShellSheet
        open={open}
        onOpenChange={onOpenChange}
        title={title}
        description={description}
        footer={footer}
      >
        {children}
      </DashboardFormShellSheet>
    );
  }

  return (
    <DashboardFormShellDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      footer={footer}
      contentClassName={contentClassName}
    >
      {children}
    </DashboardFormShellDialog>
  );
}
