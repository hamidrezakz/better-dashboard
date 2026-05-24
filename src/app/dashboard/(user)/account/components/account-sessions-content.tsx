"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  LaptopIcon,
  MonitorIcon,
  SmartphoneIcon,
  TabletIcon,
} from "lucide-react";
import { revokeOtherSessionsAction } from "@/app/action/dashboard/users/account/revoke-other-sessions-action";
import { revokeSessionAction } from "@/app/action/dashboard/users/account/revoke-session-action";
import type { SessionDeviceDisplay } from "@/app/dashboard/(user)/account/lib/format-session-device";
import { accountCopy } from "@/app/dashboard/(user)/account/lib/account-copy";
import { dashboardToast } from "@/app/dashboard/lib/dashboard-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type AccountSessionDisplay = {
  id: string;
  token: string;
  device: SessionDeviceDisplay;
  signedInLabel: string;
  expiresLabel: string;
  ipLabel: string | null;
};

type AccountSessionsContentProps = {
  sessions: AccountSessionDisplay[];
  currentSessionToken: string;
  onRevokeOthersReady?: (handler: (() => void) | null) => void;
  onRevokeOthersPendingChange?: (pending: boolean) => void;
};

const copy = accountCopy.sessions;

export function AccountSessionsContent({
  sessions,
  currentSessionToken,
  onRevokeOthersReady,
  onRevokeOthersPendingChange,
}: AccountSessionsContentProps) {
  const router = useRouter();
  const [pendingToken, setPendingToken] = React.useState<string | null>(null);
  const [isRevokingOthers, startRevokeOthers] = React.useTransition();

  const otherSessions = sessions.filter(
    (session) => session.token !== currentSessionToken,
  );

  const handleRevoke = (token: string) => {
    setPendingToken(token);
    void (async () => {
      const result = await revokeSessionAction({ token });
      setPendingToken(null);
      if (!result.success) {
        dashboardToast.error(result.error ?? "Could not revoke session.");
        return;
      }
      dashboardToast.success("Session revoked.");
      router.refresh();
    })();
  };

  const handleRevokeOthers = React.useCallback(() => {
    startRevokeOthers(async () => {
      const result = await revokeOtherSessionsAction();
      if (!result.success) {
        dashboardToast.error(
          result.error ?? "Could not revoke other sessions.",
        );
        return;
      }
      dashboardToast.success("Other sessions were signed out.");
      router.refresh();
    });
  }, [router]);

  React.useEffect(() => {
    onRevokeOthersPendingChange?.(isRevokingOthers);
  }, [isRevokingOthers, onRevokeOthersPendingChange]);

  React.useEffect(() => {
    if (otherSessions.length > 0) {
      onRevokeOthersReady?.(handleRevokeOthers);
    } else {
      onRevokeOthersReady?.(null);
    }
    return () => {
      onRevokeOthersReady?.(null);
    };
  }, [otherSessions.length, handleRevokeOthers, onRevokeOthersReady]);

  if (!sessions.length) {
    return <p className="text-sm text-muted-foreground">{copy.empty}</p>;
  }

  return (
    <ul className="-mx-4 divide-y border-y">
      {sessions.map((session) => {
        const isCurrent = session.token === currentSessionToken;
        return (
          <li key={session.id} className="flex items-start gap-4 px-4 py-4">
            <SessionDeviceIcon kind={session.device.kind} />
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium">{session.device.title}</p>
                {isCurrent ? (
                  <Badge variant="secondary" className="font-normal">
                    {copy.currentDevice}
                  </Badge>
                ) : null}
              </div>
              {session.device.subtitle ? (
                <p className="text-sm text-muted-foreground">
                  {session.device.subtitle}
                </p>
              ) : null}
              <p className="text-xs text-muted-foreground">
                {copy.signedIn} {session.signedInLabel}
                {session.ipLabel ? ` · ${copy.ip} ${session.ipLabel}` : null}
              </p>
              <p className="text-xs text-muted-foreground">
                {copy.expires} {session.expiresLabel}
              </p>
              {sessions.length === 1 && isCurrent ? (
                <p className="pt-1 text-sm text-muted-foreground">
                  {copy.onlyThisDevice}
                </p>
              ) : null}
            </div>
            {!isCurrent ? (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="shrink-0"
                disabled={pendingToken === session.token}
                onClick={() => handleRevoke(session.token)}
              >
                {pendingToken === session.token ? copy.revoking : copy.revoke}
              </Button>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function SessionDeviceIcon({ kind }: { kind: SessionDeviceDisplay["kind"] }) {
  const className = "mt-0.5 size-5 shrink-0 text-muted-foreground";

  switch (kind) {
    case "mobile":
      return <SmartphoneIcon className={className} aria-hidden />;
    case "tablet":
      return <TabletIcon className={className} aria-hidden />;
    case "desktop":
      return <MonitorIcon className={className} aria-hidden />;
    default:
      return <LaptopIcon className={className} aria-hidden />;
  }
}
