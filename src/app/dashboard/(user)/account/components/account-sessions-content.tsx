"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  LaptopIcon,
  MonitorIcon,
  SmartphoneIcon,
  TabletIcon,
} from "lucide-react";
import { revokeSessionAction } from "@/app/action/dashboard/users/account/revoke-session-action";
import type { SessionDeviceDisplay } from "@/app/dashboard/(user)/account/lib/format-session-device";
import { accountCopy } from "@/app/dashboard/(user)/account/lib/account-copy";
import { toast } from "sonner";
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
  disabled?: boolean;
};

const copy = accountCopy.sessions;

export function AccountSessionsContent({
  sessions,
  currentSessionToken,
  disabled = false,
}: AccountSessionsContentProps) {
  const router = useRouter();
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [isRevoking, startRevoke] = useTransition();

  const handleRevoke = (token: string) => {
    setPendingToken(token);
    startRevoke(async () => {
      const result = await revokeSessionAction({ token });
      setPendingToken(null);
      if (!result.success) {
        toast.error(result.error ?? "Could not revoke session.");
        return;
      }
      toast.success("Session revoked.");
      router.refresh();
    });
  };

  if (!sessions.length) {
    return <p className="text-sm text-muted-foreground">{copy.empty}</p>;
  }

  return (
    <ul className="space-y-4">
      {sessions.map((session) => {
        const isCurrent = session.token === currentSessionToken;
        const isPending = pendingToken === session.token && isRevoking;
        return (
          <li key={session.id} className="flex items-start gap-3">
            <SessionDeviceIcon kind={session.device.kind} />
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
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
                {" · "}
                {copy.expires} {session.expiresLabel}
                {session.ipLabel ? ` · ${copy.ip} ${session.ipLabel}` : null}
              </p>
              {sessions.length === 1 && isCurrent ? (
                <p className="text-sm text-muted-foreground">
                  {copy.onlyThisDevice}
                </p>
              ) : null}
            </div>
            {!isCurrent ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0"
                disabled={disabled || isPending}
                onClick={() => handleRevoke(session.token)}
              >
                {isPending ? copy.revoking : copy.revoke}
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
