"use client";

import type { ReactNode } from "react";
import {
  DashboardFormShellFooter,
  dashboardFormShellFooterSurfaceClassName,
} from "@/app/dashboard/components/form-shell/dashboard-form-shell-footer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type DashboardFormShellSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  footer: ReactNode;
  children: ReactNode;
};

export function DashboardFormShellSheet({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
}: DashboardFormShellSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal="trap-focus">
      <SheetContent
        side="bottom"
        className="inset-x-0 top-0 bottom-0 flex h-dvh max-h-dvh w-full flex-col gap-0 rounded-none border-0 p-0 data-[side=bottom]:h-dvh data-[side=bottom]:max-h-dvh sm:max-w-none"
      >
        <SheetHeader className="shrink-0 border-b p-4 pe-14 text-start">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
        <SheetFooter
          className={cn(
            dashboardFormShellFooterSurfaceClassName,
            "pb-[max(1rem,env(safe-area-inset-bottom,0px))]",
          )}
        >
          <DashboardFormShellFooter>{footer}</DashboardFormShellFooter>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
