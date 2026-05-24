"use client";

import { useCallback, useState } from "react";
import type { AccountSessionDisplay } from "@/app/dashboard/(user)/account/components/account-sessions-content";
import { AccountSessionsContent } from "@/app/dashboard/(user)/account/components/account-sessions-content";
import { accountCopy } from "@/app/dashboard/(user)/account/lib/account-copy";
import { DashboardFormShell } from "@/app/dashboard/components/form-shell/dashboard-form-shell";
import { DashboardFormShellFooterActions } from "@/app/dashboard/components/form-shell/dashboard-form-shell-footer-actions";
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
  const [revokeOthers, setRevokeOthers] = useState<(() => void) | null>(null);
  const [isRevokingOthers, setIsRevokingOthers] = useState(false);

  const handleRevokeOthersReady = useCallback(
    (handler: (() => void) | null) => {
      setRevokeOthers(handler);
    },
    [],
  );

  const hasOtherSessions = sessions.some(
    (session) => session.token !== currentSessionToken,
  );

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
        hasOtherSessions && revokeOthers ? (
          <DashboardFormShellFooterActions
            cancel={{
              label: "Close",
              onClick: onClose,
              disabled: isRevokingOthers,
            }}
            primary={{
              label: isRevokingOthers
                ? accountCopy.sessions.signingOutOthers
                : accountCopy.sessions.signOutOthers,
              onClick: revokeOthers,
              disabled: isRevokingOthers,
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
        onRevokeOthersReady={handleRevokeOthersReady}
        onRevokeOthersPendingChange={setIsRevokingOthers}
      />
    </DashboardFormShell>
  );
}
