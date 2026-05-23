"use client";

import { Button } from "@/components/ui/button";

export type NotificationFormShellFooterProps = {
  isPending: boolean;
  canSubmit: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

export function NotificationFormShellFooter({
  isPending,
  canSubmit,
  onClose,
  onSubmit,
}: NotificationFormShellFooterProps) {
  return (
    <>
      <Button disabled={isPending || !canSubmit} onClick={onSubmit}>
        {isPending ? "در حال ارسال..." : "ارسال اعلان"}
      </Button>
      <Button variant="destructive" onClick={onClose} disabled={isPending}>
        انصراف
      </Button>
    </>
  );
}
