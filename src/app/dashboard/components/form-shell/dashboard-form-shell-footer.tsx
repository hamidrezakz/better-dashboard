"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const dashboardFormShellFooterSurfaceClassName =
  "mt-0 shrink-0 flex-col gap-0 p-4 sm:flex-col";

export type DashboardFormShellFooterProps = {
  children: ReactNode;
  className?: string;
};

export function DashboardFormShellFooter({
  children,
  className,
}: DashboardFormShellFooterProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-2 **:data-[slot=button]:w-full",
        className,
      )}
    >
      {children}
    </div>
  );
}
