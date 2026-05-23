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
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

const copy = dashboardNavLabels.accountPage;

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
        {isRevokingOthers
          ? copy.sessionsSigningOutOthers
          : copy.sessionsSignOutOthers}
      </Button>
    ) : undefined;

  if (!sessions.length) {
    return (
      <Card className="gap-0">
        <CardHeader className="border-b">
          <CardTitle>{copy.sessionsTitle}</CardTitle>
          <CardDescription>{copy.sessionsDescription}</CardDescription>
        </CardHeader>
        <CardContent className="py-5">
          <p className="text-sm text-muted-foreground">{copy.sessionsEmpty}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gap-0">
      <CardHeader className="border-b">
        <CardTitle>{copy.sessionsTitle}</CardTitle>
        <CardDescription>{copy.sessionsDescription}</CardDescription>
        {headerAction ? <CardAction>{headerAction}</CardAction> : null}
      </CardHeader>
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
                        {copy.sessionsCurrentDevice}
                      </Badge>
                    ) : null}
                  </div>
                  {session.device.subtitle ? (
                    <p className="text-sm text-muted-foreground">
                      {session.device.subtitle}
                    </p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">
                    {copy.sessionsSignedIn} {session.signedInLabel}
                    {session.ipLabel
                      ? ` · ${copy.sessionsIp} ${session.ipLabel}`
                      : null}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {copy.sessionsExpires} {session.expiresLabel}
                  </p>
                </div>
                {!isCurrent ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="shrink-0"
                    disabled={pendingToken === session.token}
                    onClick={() => handleRevoke(session.token)}
                  >
                    {pendingToken === session.token
                      ? copy.sessionsRevoking
                      : copy.sessionsRevoke}
                  </Button>
                ) : null}
              </li>
            );
          })}
        </ul>
        {sessions.length === 1 ? (
          <p className="border-t px-6 py-4 text-sm text-muted-foreground">
            {copy.sessionsOnlyThisDevice}
          </p>
        ) : null}
      </CardContent>
    </Card>
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
