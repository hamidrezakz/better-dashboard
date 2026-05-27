"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const formShellFooterSurfaceClassName =
  "mt-0 shrink-0 flex-col gap-0 p-4 sm:flex-col";

export type FormShellFooterProps = {
  children: ReactNode;
  className?: string;
};

export function FormShellFooter({ children, className }: FormShellFooterProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end **:data-[slot=button]:w-full sm:**:data-[slot=button]:w-auto",
        className,
      )}
    >
      {children}
    </div>
  );
}
