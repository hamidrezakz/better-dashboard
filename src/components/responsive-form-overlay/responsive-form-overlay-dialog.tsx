"use client";

import type { ReactNode } from "react";
import {
  ResponsiveFormOverlayFooter,
  responsiveFormOverlayFooterSurfaceClassName,
} from "@/components/responsive-form-overlay/responsive-form-overlay-footer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type ResponsiveFormOverlayDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  footer: ReactNode;
  children: ReactNode;
  contentClassName?: string;
};

export function ResponsiveFormOverlayDialog({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
  contentClassName,
}: ResponsiveFormOverlayDialogProps) {
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
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
        <DialogFooter className={responsiveFormOverlayFooterSurfaceClassName}>
          <ResponsiveFormOverlayFooter>{footer}</ResponsiveFormOverlayFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
