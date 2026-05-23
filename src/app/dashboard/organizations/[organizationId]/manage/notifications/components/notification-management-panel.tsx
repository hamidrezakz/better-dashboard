"use client";

import { useState } from "react";
import { NotificationFormShell } from "@/app/dashboard/organizations/[organizationId]/manage/notifications/components/notification-form-shell";
import type { NotificationFormTarget } from "@/app/dashboard/organizations/[organizationId]/manage/notifications/components/notification-form";
import { NotificationViewDialog } from "@/app/dashboard/organizations/[organizationId]/manage/notifications/components/notification-view-dialog";
import { NotificationsTable } from "@/app/dashboard/organizations/[organizationId]/manage/notifications/components/notifications-table";
import type { OrganizationNotificationItem } from "@/app/dashboard/organizations/[organizationId]/manage/notifications/lib/notification-form-utils";

type NotificationFeedback = {
  kind: "success" | "error";
  message: string;
};

type NotificationManagementPanelProps = {
  organizationId: string;
  teams: Array<{
    id: string;
    name: string;
  }>;
  notifications: OrganizationNotificationItem[];
  page: number;
  pageSize: number;
  totalCount: number;
};

export function NotificationManagementPanel({
  organizationId,
  teams,
  notifications,
  page,
  pageSize,
  totalCount,
}: NotificationManagementPanelProps) {
  const [feedback, setFeedback] = useState<NotificationFeedback | null>(null);
  const [viewNotification, setViewNotification] =
    useState<OrganizationNotificationItem | null>(null);
  const [formTarget, setFormTarget] = useState<NotificationFormTarget | null>(
    null,
  );

  return (
    <div className="space-y-4">
      <NotificationsTable
        organizationId={organizationId}
        notifications={notifications}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        feedback={feedback}
        onView={setViewNotification}
        onCreate={() => setFormTarget({ mode: "create" })}
        onFeedback={setFeedback}
      />

      <NotificationViewDialog
        notification={viewNotification}
        onClose={() => setViewNotification(null)}
      />

      <NotificationFormShell
        organizationId={organizationId}
        target={formTarget}
        teams={teams}
        onClose={() => setFormTarget(null)}
        onFeedback={setFeedback}
      />
    </div>
  );
}
