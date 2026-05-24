"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { revokeOtherSessionsAction } from "@/app/action/dashboard/users/account/revoke-other-sessions-action";
import type { AccountSessionDisplay } from "@/app/dashboard/(user)/account/components/account-sessions-content";
import { AccountSessionsContent } from "@/app/dashboard/(user)/account/components/account-sessions-content";
import { accountCopy } from "@/app/dashboard/(user)/account/lib/account-copy";
import { DashboardFormShell } from "@/app/dashboard/components/form-shell/dashboard-form-shell";
import { DashboardFormShellFooterActions } from "@/app/dashboard/components/form-shell/dashboard-form-shell-footer-actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type AccountSessionsFormShellProps = {
  sessions: AccountSessionDisplay[];
  currentSessionToken: string;
  open: boolean;
  onClose: () => void;
};

export function AccountSessionsFormShell({
  sessions,
  currentSessionToken,
  open,
  onClose,
}: AccountSessionsFormShellProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const hasOtherSessions = sessions.some(
    (session) => session.token !== currentSessionToken,
  );

  const handleRevokeOthers = () => {
    startTransition(async () => {
      const result = await revokeOtherSessionsAction();
      if (!result.success) {
        toast.error(result.error ?? "Could not revoke other sessions.");
        return;
      }
      toast.success("Other sessions were signed out.");
      router.refresh();
    });
  };

  return (
    <DashboardFormShell
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
      title={accountCopy.sessions.title}
      description={accountCopy.sessions.description}
      contentClassName="px-0"
      footer={
        hasOtherSessions ? (
          <DashboardFormShellFooterActions
            cancel={{
              label: "Close",
              onClick: onClose,
              disabled: isPending,
            }}
            primary={{
              label: isPending
                ? accountCopy.sessions.signingOutOthers
                : accountCopy.sessions.signOutOthers,
              onClick: handleRevokeOthers,
              disabled: isPending,
            }}
          />
        ) : (
          <div className="flex w-full justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        )
      }
    >
      <AccountSessionsContent
        sessions={sessions}
        currentSessionToken={currentSessionToken}
        disabled={isPending}
      />
    </DashboardFormShell>
  );
}
