"use client";

import { useState } from "react";
import { NotificationViewDialog } from "@/app/dashboard/components/notifications/notification-view-dialog";
import { UserNotificationsTable } from "@/app/dashboard/(user)/notifications/components/user-notifications-table";
import type { UserNotificationListItem } from "@/app/dashboard/(user)/notifications/lib/get-user-notifications-page";
import type { UserNotificationTableFilter } from "@/app/dashboard/(user)/notifications/lib/user-notifications-table-params";

type UserNotificationsPanelProps = {
  userId: string;
  isOwnInbox: boolean;
  canMarkRead: boolean;
  notifications: UserNotificationListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  filter: UserNotificationTableFilter;
};

export function UserNotificationsPanel({
  userId,
  isOwnInbox,
  canMarkRead,
  notifications,
  page,
  pageSize,
  totalCount,
  filter,
}: UserNotificationsPanelProps) {
  const [viewNotification, setViewNotification] =
    useState<UserNotificationListItem | null>(null);

  return (
    <>
      <UserNotificationsTable
        isOwnInbox={isOwnInbox}
        notifications={notifications}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        filter={filter}
        onView={setViewNotification}
      />

      <NotificationViewDialog
        notification={viewNotification}
        onClose={() => setViewNotification(null)}
        markReadOnOpen={
          canMarkRead && Boolean(viewNotification && !viewNotification.readAt)
        }
      />
    </>
  );
}
