"use client";

import { Button } from "@/components/ui/button";

type FooterActionProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

type FormShellFooterActionsProps = {
  cancel: FooterActionProps;
  primary: FooterActionProps;
};

export function FormShellFooterActions({
  cancel,
  primary,
}: FormShellFooterActionsProps) {
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
