"use client";

import { Button } from "@/components/ui/button";

export type InvitationFormShellFooterProps = {
  isEdit: boolean;
  isPending: boolean;
  canSubmit: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

export function InvitationFormShellFooter({
  isEdit,
  isPending,
  canSubmit,
  onClose,
  onSubmit,
}: InvitationFormShellFooterProps) {
  return (
    <>
      <Button disabled={isPending || !canSubmit} onClick={onSubmit}>
        {isPending
          ? isEdit
            ? "Saving..."
            : "Creating..."
          : isEdit
            ? "Save"
            : "Create"}
      </Button>
      <Button variant="destructive" onClick={onClose} disabled={isPending}>
        Cancel
      </Button>
    </>
  );
}
