"use client";

import type { ReactNode } from "react";
import {
  FormShellFooter,
  formShellFooterSurfaceClassName,
} from "@/components/form-shell/form-shell-footer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type FormShellDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  footer: ReactNode;
  children: ReactNode;
  contentClassName?: string;
};

export function FormShellDialog({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
  contentClassName,
}: FormShellDialogProps) {
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
        <DialogFooter className={formShellFooterSurfaceClassName}>
          <FormShellFooter>{footer}</FormShellFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
