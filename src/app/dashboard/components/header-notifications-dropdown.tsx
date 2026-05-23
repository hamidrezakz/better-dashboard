"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BellIcon, CheckCheckIcon, ChevronLeftIcon } from "lucide-react";
import { markAllNotificationsAsReadAction } from "@/app/action/dashboard/users/notifications/mark-all-notifications-read-action";
import { NotificationViewDialog } from "@/app/dashboard/components/notification-view-dialog";
import type { HeaderNotificationItem } from "@/app/dashboard/lib/get-header-notifications";
import type { NotificationViewItem } from "@/app/dashboard/lib/notification-view-types";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import { buildNotificationSourceInline } from "@/app/dashboard/lib/notification-source-label";
import { dateTimeOptions, formatDate } from "@/lib/format-date";
import { truncateText } from "@/lib/truncate-text";
import { NotificationTypeBadge } from "@/components/globals-badge/notification-type-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type HeaderNotificationsDropdownProps = {
  userId: string;
  items: HeaderNotificationItem[];
  hasMore: boolean;
  unreadTotalCount: number;
};

const HEADER_TITLE_MAX = 120;

function toViewItem(item: HeaderNotificationItem): NotificationViewItem {
  return {
    id: item.id,
    title: item.title,
    body: item.body,
    type: item.type,
    audience: item.audience,
    createdAt: item.createdAt,
    readAt: item.readAt,
    teamName: item.teamName,
    organizationName: item.organizationName,
    createdByName: item.createdByName,
    sourceLabel: item.sourceLabel,
  };
}

function NotificationList({
  items,
  onSelect,
}: {
  items: HeaderNotificationItem[];
  onSelect: (item: HeaderNotificationItem) => void;
}) {
  if (!items.length) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
        <span className="flex size-10 items-center justify-center rounded-full bg-muted">
          <BellIcon className="size-4 text-muted-foreground" />
        </span>
        <p className="text-xs text-muted-foreground">
          You have no unread notifications.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border/60">
      {items.map((item) => {
        const sourceInline = buildNotificationSourceInline({
          organizationName: item.organizationName,
          teamName: item.teamName,
          createdByName: item.createdByName,
        });

        return (
          <li key={item.id}>
            <button
              type="button"
              className="group flex w-full gap-2.5 px-2.5 py-2.5 text-start transition-colors hover:bg-muted/50"
              onClick={() => onSelect(item)}
            >
              <span className="min-w-0 flex-1 space-y-1">
                <p className="line-clamp-2 min-w-0 text-xs font-medium leading-snug text-foreground">
                  <span
                    className="me-1.5 inline-block size-1.5 shrink-0 align-middle translate-y-px rounded-full bg-primary animate-pulse"
                    aria-hidden
                  />

                  {truncateText(item.title, HEADER_TITLE_MAX)}
                </p>
                <span className="block truncate text-[0.625rem] text-muted-foreground/90">
                  {sourceInline ? <span>{sourceInline} </span> : null}
                  <span>
                    {formatDate(item.createdAt, dateTimeOptions)}
                  </span>
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function HeaderNotificationsDropdown({
  userId,
  items,
  hasMore,
  unreadTotalCount,
}: HeaderNotificationsDropdownProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewNotification, setViewNotification] =
    useState<NotificationViewItem | null>(null);

  const handleMarkAllRead = () => {
    startTransition(async () => {
      await markAllNotificationsAsReadAction();
      router.refresh();
    });
  };

  const handleSelect = (item: HeaderNotificationItem) => {
    setMenuOpen(false);
    setViewNotification(toViewItem(item));
  };

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="relative"
              aria-label="Notifications"
            />
          }
        >
          <BellIcon />
          {unreadTotalCount > 0 && (
            <Badge className="absolute -inset-e-1 -top-1 h-4 min-w-4 px-1 text-[0.55rem]">
              {unreadTotalCount > 99 ? "99+" : unreadTotalCount}
            </Badge>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="flex w-88 flex-col overflow-hidden p-0 max-sm:w-[calc(100vw-2rem)]"
        >
          <div className="flex shrink-0 items-center justify-between border-b px-2.5 py-2">
            <p className="text-xs font-medium text-foreground">
              New notifications
            </p>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={isPending || !unreadTotalCount}
              onClick={handleMarkAllRead}
              aria-label="Mark all as read"
            >
              <CheckCheckIcon />
            </Button>
          </div>

          <div className="max-h-86 min-h-0 overflow-y-auto overscroll-contain">
            <NotificationList items={items} onSelect={handleSelect} />
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-auto shrink-0 w-full justify-between rounded-none border-t! bg-muted/30 px-2.5 py-2 text-[0.6875rem] hover:bg-muted/60"
            render={<Link href={dashboardRoutes.userNotifications(userId)} />}
          >
            {hasMore ? "View all notifications" : "Notification center"}
            <ChevronLeftIcon className="size-3.5 opacity-60" />
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>

      <NotificationViewDialog
        notification={viewNotification}
        onClose={() => setViewNotification(null)}
        markReadOnOpen
      />
    </>
  );
}
