"use client";

import type { ReactNode } from "react";
import { ResponsiveFormOverlayDialog } from "@/components/responsive-form-overlay/responsive-form-overlay-dialog";
import { ResponsiveFormOverlaySheet } from "@/components/responsive-form-overlay/responsive-form-overlay-sheet";
import { useIsMobile } from "@/hooks/use-mobile";

export type ResponsiveFormOverlayProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  footer: ReactNode;
  children: ReactNode;
  contentClassName?: string;
};

export function ResponsiveFormOverlay({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
  contentClassName,
}: ResponsiveFormOverlayProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <ResponsiveFormOverlaySheet
        open={open}
        onOpenChange={onOpenChange}
        title={title}
        description={description}
        footer={footer}
      >
        {children}
      </ResponsiveFormOverlaySheet>
    );
  }

  return (
    <ResponsiveFormOverlayDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      footer={footer}
      contentClassName={contentClassName}
    >
      {children}
    </ResponsiveFormOverlayDialog>
  );
}
