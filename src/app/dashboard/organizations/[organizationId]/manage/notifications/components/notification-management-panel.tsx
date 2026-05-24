"use client";

import { useState } from "react";
import { NotificationFormShell } from "@/app/dashboard/organizations/[organizationId]/manage/notifications/components/notification-form-shell";
import type { NotificationFormTarget } from "@/app/dashboard/organizations/[organizationId]/manage/notifications/components/notification-form";
import { NotificationViewDialog } from "@/app/dashboard/organizations/[organizationId]/manage/notifications/components/notification-view-dialog";
import { NotificationsTable } from "@/app/dashboard/organizations/[organizationId]/manage/notifications/components/notifications-table";
import type { OrganizationNotificationItem } from "@/app/dashboard/organizations/[organizationId]/manage/notifications/lib/notification-form-utils";

type NotificationPanelTarget =
  | { kind: "view"; notification: OrganizationNotificationItem }
  | NotificationFormTarget
  | null;

function isViewTarget(
  target: NotificationPanelTarget,
): target is { kind: "view"; notification: OrganizationNotificationItem } {
  return target !== null && "kind" in target && target.kind === "view";
}

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
  const [panelTarget, setPanelTarget] = useState<NotificationPanelTarget>(null);

  const viewNotification = isViewTarget(panelTarget)
    ? panelTarget.notification
    : null;
  const formTarget = isViewTarget(panelTarget) ? null : panelTarget;

  return (
    <div className="space-y-4">
      <NotificationsTable
        organizationId={organizationId}
        notifications={notifications}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onView={(notification) =>
          setPanelTarget({ kind: "view", notification })
        }
        onCreate={() => setPanelTarget({ mode: "create" })}
      />

      <NotificationViewDialog
        notification={viewNotification}
        onClose={() => setPanelTarget(null)}
      />

      <NotificationFormShell
        organizationId={organizationId}
        target={formTarget}
        teams={teams}
        onClose={() => setPanelTarget(null)}
      />
    </div>
  );
}
