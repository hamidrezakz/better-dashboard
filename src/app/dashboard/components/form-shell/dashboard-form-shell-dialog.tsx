"use client";

import type { ReactNode } from "react";
import {
  DashboardFormShellFooter,
  dashboardFormShellFooterSurfaceClassName,
} from "@/app/dashboard/components/form-shell/dashboard-form-shell-footer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type DashboardFormShellDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  footer: ReactNode;
  children: ReactNode;
  contentClassName?: string;
};

export function DashboardFormShellDialog({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
  contentClassName,
}: DashboardFormShellDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "flex max-h-[min(32rem,90dvh)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg",
          contentClassName,
        )}
      >
        <DialogHeader className="shrink-0 border-b p-4 pe-12 text-start">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
        <DialogFooter className={dashboardFormShellFooterSurfaceClassName}>
          <DashboardFormShellFooter>{footer}</DashboardFormShellFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
