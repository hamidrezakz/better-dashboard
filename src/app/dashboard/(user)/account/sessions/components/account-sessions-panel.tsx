"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { revokeOtherSessionsAction } from "@/app/action/dashboard/users/account/revoke-other-sessions-action";
import { revokeSessionAction } from "@/app/action/dashboard/users/account/revoke-session-action";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type AccountSessionDisplay = {
  id: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  ipAddress: string | null;
  userAgent: string | null;
};

type AccountSessionsPanelProps = {
  sessions: AccountSessionDisplay[];
  currentSessionToken: string;
};

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

  if (!sessions.length) {
    return (
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No active sessions were found.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
        <CardTitle>Sessions</CardTitle>
        {otherSessions.length > 0 ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isRevokingOthers}
            onClick={handleRevokeOthers}
          >
            {isRevokingOthers ? "Signing out..." : "Sign out other sessions"}
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        <ul className="divide-y rounded-lg border">
          {sessions.map((session) => {
            const isCurrent = session.token === currentSessionToken;
            return (
              <li
                key={session.id}
                className="flex flex-wrap items-start justify-between gap-3 p-3"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">
                      {formatSessionLabel(session.userAgent)}
                    </span>
                    {isCurrent ? (
                      <Badge variant="secondary">This device</Badge>
                    ) : null}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {session.ipAddress ? `IP ${session.ipAddress} · ` : null}
                    Signed in {formatDateTime(session.createdAt)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Expires {formatDateTime(session.expiresAt)}
                  </p>
                </div>
                {!isCurrent ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={pendingToken === session.token}
                    onClick={() => handleRevoke(session.token)}
                  >
                    {pendingToken === session.token ? "Revoking..." : "Revoke"}
                  </Button>
                ) : null}
              </li>
            );
          })}
        </ul>
        {sessions.length === 1 ? (
          <p className="text-sm text-muted-foreground">
            You are only signed in on this device.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function formatSessionLabel(userAgent: string | null) {
  if (!userAgent) {
    return "Unknown device";
  }

  const trimmed = userAgent.trim();
  if (trimmed.length <= 72) {
    return trimmed;
  }

  return `${trimmed.slice(0, 69)}...`;
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString();
}
