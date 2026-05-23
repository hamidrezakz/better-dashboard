"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { markNotificationReadAction } from "@/app/action/dashboard/users/notifications/mark-notification-read-action";
import type { NotificationViewItem } from "@/app/dashboard/lib/notification-view-types";
import { buildNotificationSourceInline } from "@/app/dashboard/lib/notification-source-label";
import { getNotificationTypeBadgeConfig } from "@/components/globals-badge/badge-config";
import { formatPersianDateWithParenthesizedTime } from "@/lib/format-persian-date";
import { Button } from "@/components/ui/button";
import { BellIcon, CheckCheckIcon, ClockIcon, LayersIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

  const typeIcon = displayed
    ? getNotificationTypeBadgeConfig(displayed.type).icon
    : null;

  return (
    <Dialog
      open={Boolean(notification)}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="shrink-0 space-y-1 px-4 pt-4 pb-2">
          <DialogTitle className="flex items-center gap-1.5">
            <BellIcon className="size-3.5 shrink-0 text-muted-foreground" />
            جزئیات اعلان
          </DialogTitle>
        </DialogHeader>

        {displayed ? (
          <div className="min-h-0 flex-1 overflow-y-auto px-4 my-2 pb-4">
            <div className="flex gap-3">
              <div className="min-w-0 flex-1 space-y-5">
                <div className="flex space-y-2 flex-col">
                  <p className="text-base font-semibold leading-snug">
                    {displayed.title}
                  </p>

                  {displayed.body ? (
                    <p className="whitespace-pre-wrap wrap-break-word text-xs leading-relaxed text-muted-foreground">
                      {displayed.body}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-1 text-[0.625rem] text-muted-foreground/90">
                  {sourceInline ? (
                    <p className="flex items-start gap-1.5">
                      <LayersIcon className="mt-px size-3 shrink-0 opacity-70" />
                      <span>{sourceInline}</span>
                    </p>
                  ) : null}
                  <p className="flex items-center gap-1.5">
                    <ClockIcon className="size-3 shrink-0 opacity-70" />
                    <span>
                      {formatPersianDateWithParenthesizedTime(
                        displayed.createdAt,
                      )}
                    </span>
                  </p>
                  {displayed.readAt ? (
                    <p className="flex items-center gap-1.5">
                      <CheckCheckIcon className="size-3 shrink-0 opacity-70" />
                      <span>
                        خوانده‌شده{" "}
                        {formatPersianDateWithParenthesizedTime(
                          displayed.readAt,
                        )}
                      </span>
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <DialogFooter className="shrink-0 px-4 pb-4">
          <Button variant="outline" className="w-full" onClick={onClose}>
            بستن
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
