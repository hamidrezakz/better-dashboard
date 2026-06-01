"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const responsiveFormOverlayFooterSurfaceClassName =
  "mt-0 shrink-0 flex-col gap-0 p-4 sm:flex-col";

export type ResponsiveFormOverlayFooterProps = {
  children: ReactNode;
  className?: string;
};

export function ResponsiveFormOverlayFooter({
  children,
  className,
}: ResponsiveFormOverlayFooterProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col-reverse gap-2 sm:flex-row ltr:sm:justify-end rtl:sm:flex-row-reverse rtl:sm:justify-start **:data-[slot=button]:w-full sm:**:data-[slot=button]:w-auto",
        className,
      )}
    >
      {children}
    </div>
  );
}
