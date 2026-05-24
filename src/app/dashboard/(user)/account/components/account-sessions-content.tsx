"use client";

import { Fragment, useState, useTransition } from "react";
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
import {
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";

export type AccountSessionDisplay = {
  id: string;
  token: string;
  device: SessionDeviceDisplay;
  signedInLabel: string;
  signedInTitle: string;
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

  const onlyCurrentDevice =
    sessions.length === 1 && sessions[0]?.token === currentSessionToken;

  return (
    <div className="space-y-3">
      <ItemGroup className="gap-0" role="list">
        {sessions.map((session, index) => {
          const isCurrent = session.token === currentSessionToken;
          const isPending = pendingToken === session.token && isRevoking;

          return (
            <Fragment key={session.id}>
              {index > 0 ? <ItemSeparator /> : null}
              <article
                role="listitem"
                className="flex w-full items-start gap-2.5 py-3"
              >
                <SessionDeviceIcon kind={session.device.kind} />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <ItemTitle className="text-sm">
                        {session.device.title}
                      </ItemTitle>
                      {session.device.subtitle ? (
                        <ItemDescription className="text-sm">
                          {session.device.subtitle}
                        </ItemDescription>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 items-center justify-end">
                      {isCurrent ? (
                        <Badge variant="secondary" className="font-normal">
                          {copy.currentDevice}
                        </Badge>
                      ) : (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          disabled={disabled || isPending}
                          onClick={() => handleRevoke(session.token)}
                        >
                          {isPending ? copy.revoking : copy.revoke}
                        </Button>
                      )}
                    </div>
                  </div>
                  <SessionMetaList session={session} />
                </div>
              </article>
            </Fragment>
          );
        })}
      </ItemGroup>
      {onlyCurrentDevice ? (
        <p className="text-sm text-muted-foreground">{copy.onlyThisDevice}</p>
      ) : null}
    </div>
  );
}

function SessionMetaList({ session }: { session: AccountSessionDisplay }) {
  const rows: { label: string; value: string; title?: string }[] = [
    {
      label: copy.signedIn,
      value: session.signedInLabel,
      title: session.signedInTitle,
    },
    { label: copy.expires, value: session.expiresLabel },
  ];

  if (session.ipLabel) {
    rows.push({ label: copy.ip, value: session.ipLabel });
  }

  return (
    <dl className="grid w-full grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-xs">
      {rows.map((row) => (
        <Fragment key={row.label}>
          <dt className="text-muted-foreground">{row.label}</dt>
          <dd
            className="min-w-0 truncate text-end text-foreground tabular-nums"
            title={row.title ?? row.value}
          >
            {row.value}
          </dd>
        </Fragment>
      ))}
    </dl>
  );
}

function SessionDeviceIcon({ kind }: { kind: SessionDeviceDisplay["kind"] }) {
  const className = "mt-0.5 size-4 shrink-0 text-muted-foreground";

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
