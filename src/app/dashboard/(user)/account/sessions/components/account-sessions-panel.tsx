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
import {
  AccountSectionCard,
  AccountSectionCardBody,
} from "@/app/dashboard/(user)/account/components/account-section-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";

export type AccountSessionDisplay = {
  id: string;
  token: string;
  device: SessionDeviceDisplay;
  signedInLabel: string;
  expiresLabel: string;
  ipLabel: string | null;
};

type AccountSessionsPanelProps = {
  sessions: AccountSessionDisplay[];
  currentSessionToken: string;
};

const copy = accountCopy.sessions;

export function AccountSessionsPanel({
  sessions,
  currentSessionToken,
}: AccountSessionsPanelProps) {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [pendingToken, setPendingToken] = React.useState<string | null>(null);
  const [isRevokingOthers, startRevokeOthers] = React.useTransition();

  const otherSessions = sessions.filter(
    (session) => session.token !== currentSessionToken,
  );

  const handleRevoke = (token: string) => {
    setError(null);
    setPendingToken(token);
    void (async () => {
      const result = await revokeSessionAction({ token });
      setPendingToken(null);
      if (!result.success) {
        setError(result.error ?? "Could not revoke session.");
        return;
      }
      router.refresh();
    })();
  };

  const handleRevokeOthers = () => {
    setError(null);
    startRevokeOthers(async () => {
      const result = await revokeOtherSessionsAction();
      if (!result.success) {
        setError(result.error ?? "Could not revoke other sessions.");
        return;
      }
      router.refresh();
    });
  };

  const headerAction =
    otherSessions.length > 0 ? (
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isRevokingOthers}
        onClick={handleRevokeOthers}
      >
        {isRevokingOthers ? copy.signingOutOthers : copy.signOutOthers}
      </Button>
    ) : undefined;

  if (!sessions.length) {
    return (
      <AccountSectionCard title={copy.title}>
        <AccountSectionCardBody>
          <p className="text-sm text-muted-foreground">{copy.empty}</p>
        </AccountSectionCardBody>
      </AccountSectionCard>
    );
  }

  return (
    <AccountSectionCard title={copy.title} action={headerAction}>
      <CardContent className="space-y-4 p-0">
        {error ? (
          <Alert variant="destructive" className="mx-6 mt-5">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        <ul className="divide-y">
          {sessions.map((session) => {
            const isCurrent = session.token === currentSessionToken;
            return (
              <li key={session.id} className="flex items-start gap-4 px-6 py-4">
                <SessionDeviceIcon kind={session.device.kind} />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">
                      {session.device.title}
                    </p>
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
                    {session.ipLabel
                      ? ` · ${copy.ip} ${session.ipLabel}`
                      : null}
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
                    {pendingToken === session.token
                      ? copy.revoking
                      : copy.revoke}
                  </Button>
                ) : null}
              </li>
            );
          })}
        </ul>
      </CardContent>
    </AccountSectionCard>
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
