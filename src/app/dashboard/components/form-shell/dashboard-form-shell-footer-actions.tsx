"use client";

import { Button } from "@/components/ui/button";

type FooterActionProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

type DashboardFormShellFooterActionsProps = {
  cancel: FooterActionProps;
  primary: FooterActionProps;
};

export function DashboardFormShellFooterActions({
  cancel,
  primary,
}: DashboardFormShellFooterActionsProps) {
  return (
    <>
      <Button
        type="button"
        variant="outline"
        disabled={cancel.disabled}
        onClick={cancel.onClick}
      >
        {cancel.label}
      </Button>
      <Button
        type="button"
        disabled={primary.disabled}
        onClick={primary.onClick}
      >
        {primary.label}
      </Button>
    </>
  );
}
