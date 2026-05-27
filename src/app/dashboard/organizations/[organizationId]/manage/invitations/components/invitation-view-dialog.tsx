"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckIcon,
  ClockIcon,
  CopyIcon,
  Link2Icon,
  TimerIcon,
  UserIcon,
} from "lucide-react";
import { resolveInvitationJoinScope } from "@/app/join/lib/invitation-scope";
import {
  getInvitationContactLabel,
  type OrganizationInvitationItem,
} from "@/app/dashboard/organizations/[organizationId]/manage/invitations/lib/invitation-form-utils";
import { ResponsiveFormOverlay } from "@/components/responsive-form-overlay/responsive-form-overlay";
import { dateTimeOptions, formatDate } from "@/lib/format-date";
import {
  formatInvitationUsageLabel,
  resolveInvitationDisplayStatus,
} from "@/lib/badge/invitation-display-status";
import { badgeLabels } from "@/lib/badge/badge-labels";
import { joinRoutes } from "@/app/join/lib/join-routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type InvitationViewDialogProps = {
  invitation: OrganizationInvitationItem | null;
  onClose: () => void;
};

const COPY_FEEDBACK_MS = 1000;

export function InvitationViewDialog({
  invitation,
  onClose,
}: InvitationViewDialogProps) {
  const [copied, setCopied] = useState(false);

  const joinUrl = invitation
    ? joinRoutes.invitationAbsolute(invitation.id)
    : null;

  useEffect(() => {
    if (!copied) {
      return;
    }
    const timeoutId = window.setTimeout(
      () => setCopied(false),
      COPY_FEEDBACK_MS,
    );
    return () => window.clearTimeout(timeoutId);
  }, [copied]);

  const onCopy = useCallback(async () => {
    if (!joinUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }, [joinUrl]);

  const joinScope = invitation
    ? resolveInvitationJoinScope({
        organizationId: invitation.organizationId,
        teamId: invitation.teamId,
      })
    : "unknown";

  const displayStatus = invitation
    ? resolveInvitationDisplayStatus(invitation)
    : null;

  const destinationLabel =
    joinScope === "unknown"
      ? badgeLabels.invitationJoinScope.unknown
      : badgeLabels.invitationJoinScope[joinScope];

  return (
    <ResponsiveFormOverlay
      open={Boolean(invitation)}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
      title="Invitation details"
      footer={
        <div className="flex w-full justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      {invitation ? (
        <div className="space-y-4">
          <p className="flex items-center gap-1.5 text-base font-semibold leading-snug">
            <Link2Icon className="size-3.5 shrink-0 text-muted-foreground" />
            {getInvitationContactLabel()}
          </p>

          <div className="flex flex-col gap-1 text-[0.625rem] text-muted-foreground/90">
            <p className="flex items-start gap-1.5">
              <Link2Icon className="mt-px size-3 shrink-0 opacity-70" />
              <span>
                {destinationLabel}
                {invitation.teamName ? ` · ${invitation.teamName}` : null}
              </span>
            </p>
            {displayStatus ? (
              <p className="flex items-center gap-1.5">
                <TimerIcon className="size-3 shrink-0 opacity-70" />
                <span>
                  {badgeLabels.invitationDisplayStatus[displayStatus]}
                </span>
              </p>
            ) : null}
            <p className="flex items-center gap-1.5">
              <ClockIcon className="size-3 shrink-0 opacity-70" />
              <span className="tabular-nums">
                Expires {formatDate(invitation.expiresAt, dateTimeOptions)}
              </span>
            </p>
            <p className="flex items-center gap-1.5">
              <ClockIcon className="size-3 shrink-0 opacity-70" />
              <span className="tabular-nums">
                Created {formatDate(invitation.createdAt, dateTimeOptions)}
              </span>
            </p>
            <p className="flex items-center gap-1.5">
              <UserIcon className="size-3 shrink-0 opacity-70" />
              <span>
                {formatInvitationUsageLabel(
                  invitation.usedCount,
                  invitation.maxUses,
                )}{" "}
                · {invitation.inviterName}
              </span>
            </p>
          </div>

          {joinUrl ? (
            <div className="space-y-1.5">
              <p className="text-[0.625rem] text-muted-foreground">Join link</p>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={joinUrl}
                  dir="ltr"
                  className="h-8 min-w-0 flex-1 font-mono text-[0.6875rem]"
                  onFocus={(event) => event.currentTarget.select()}
                  onClick={(event) => event.currentTarget.select()}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  className="shrink-0"
                  onClick={onCopy}
                  aria-label={copied ? "Copied" : "Copy link"}
                >
                  {copied ? (
                    <CheckIcon className="text-primary" aria-hidden />
                  ) : (
                    <CopyIcon aria-hidden />
                  )}
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </ResponsiveFormOverlay>
  );
}
