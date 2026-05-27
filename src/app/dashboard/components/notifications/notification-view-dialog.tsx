"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { markNotificationReadAction } from "@/app/action/dashboard/users/notifications/mark-notification-read-action";
import type { NotificationViewItem } from "@/app/dashboard/lib/notifications/notification-view-types";
import { buildNotificationSourceInline } from "@/app/dashboard/lib/notifications/notification-source-label";
import { FormShell } from "@/components/form-shell/form-shell";
import { NotificationTypeBadge } from "@/components/badge/notification-type-badge";
import { dateTimeOptions, formatDate } from "@/lib/format-date";
import { Button } from "@/components/ui/button";
import {
  BellIcon,
  CheckCheckIcon,
  ClockIcon,
  LayersIcon,
  TagIcon,
} from "lucide-react";

type NotificationViewDialogProps = {
  notification: NotificationViewItem | null;
  onClose: () => void;
  markReadOnOpen?: boolean;
};

export function NotificationViewDialog({
  notification,
  onClose,
  markReadOnOpen = false,
}: NotificationViewDialogProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [displayed, setDisplayed] = useState<NotificationViewItem | null>(
    notification,
  );

  useEffect(() => {
    setDisplayed(notification);
  }, [notification]);

  useEffect(() => {
    if (!displayed || !markReadOnOpen || displayed.readAt) {
      return;
    }

    startTransition(async () => {
      const result = await markNotificationReadAction({
        notificationId: displayed.id,
      });

      if (result.success && result.readAt) {
        setDisplayed((current) =>
          current ? { ...current, readAt: result.readAt } : null,
        );
      }

      router.refresh();
    });
  }, [displayed, markReadOnOpen, router]);

  const sourceInline = displayed
    ? buildNotificationSourceInline({
        organizationName: displayed.organizationName ?? null,
        teamName: displayed.teamName ?? null,
        createdByName: displayed.createdByName ?? null,
      })
    : null;

  return (
    <FormShell
      open={Boolean(notification)}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
      title="Notification details"
      footer={
        <div className="flex w-full justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      {displayed ? (
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <p className="flex items-center gap-1.5 text-base font-semibold leading-snug">
              <BellIcon className="size-3.5 shrink-0 text-muted-foreground" />
              {displayed.title}
            </p>

            {displayed.body ? (
              <p className="whitespace-pre-wrap wrap-break-word text-xs leading-relaxed text-muted-foreground">
                {displayed.body}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1 text-[0.625rem] text-muted-foreground/90">
            <p className="flex items-center gap-1.5">
              <TagIcon className="size-3 shrink-0 opacity-70" />
              <NotificationTypeBadge type={displayed.type} compact />
            </p>
            {sourceInline ? (
              <p className="flex items-start gap-1.5">
                <LayersIcon className="mt-px size-3 shrink-0 opacity-70" />
                <span>{sourceInline}</span>
              </p>
            ) : null}
            <p className="flex items-center gap-1.5">
              <ClockIcon className="size-3 shrink-0 opacity-70" />
              <span>{formatDate(displayed.createdAt, dateTimeOptions)}</span>
            </p>
            {displayed.readAt ? (
              <p className="flex items-center gap-1.5">
                <CheckCheckIcon className="size-3 shrink-0 opacity-70" />
                <span>
                  Read {formatDate(displayed.readAt, dateTimeOptions)}
                </span>
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </FormShell>
  );
}
