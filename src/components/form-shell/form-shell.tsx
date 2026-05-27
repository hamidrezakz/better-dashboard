"use client";

import type { ReactNode } from "react";
import { FormShellDialog } from "@/components/form-shell/form-shell-dialog";
import { FormShellSheet } from "@/components/form-shell/form-shell-sheet";
import { useIsMobile } from "@/hooks/use-mobile";

export type FormShellProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  footer: ReactNode;
  children: ReactNode;
  contentClassName?: string;
};

export function FormShell({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
  contentClassName,
}: FormShellProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <FormShellSheet
        open={open}
        onOpenChange={onOpenChange}
        title={title}
        description={description}
        footer={footer}
      >
        {children}
      </FormShellSheet>
    );
  }

  return (
    <FormShellDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      footer={footer}
      contentClassName={contentClassName}
    >
      {children}
    </FormShellDialog>
  );
}
