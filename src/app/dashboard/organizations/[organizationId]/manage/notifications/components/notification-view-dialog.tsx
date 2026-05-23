"use client";

import { NotificationViewDialog as SharedNotificationViewDialog } from "@/app/dashboard/components/notifications/notification-view-dialog";
import type { OrganizationNotificationItem } from "@/app/dashboard/organizations/[organizationId]/manage/notifications/lib/notification-form-utils";

type NotificationViewDialogProps = {
  notification: OrganizationNotificationItem | null;
  onClose: () => void;
};

export function NotificationViewDialog({
  notification,
  onClose,
}: NotificationViewDialogProps) {
  const viewItem = notification
    ? {
        id: notification.id,
        title: notification.title,
        body: notification.body,
        type: notification.type,
        audience: notification.audience,
        createdAt: notification.createdAt,
        userName: notification.userName,
        userEmail: notification.userEmail,
        userImage: notification.userImage,
        teamName: notification.teamName,
      }
    : null;

  return (
    <SharedNotificationViewDialog notification={viewItem} onClose={onClose} />
  );
}
