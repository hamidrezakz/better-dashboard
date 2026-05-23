"use client";

import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { NotificationRowActionsMenu } from "@/app/dashboard/organizations/[organizationId]/manage/notifications/components/notification-row-actions-menu";
import { type OrganizationNotificationItem } from "@/app/dashboard/organizations/[organizationId]/manage/notifications/lib/notification-form-utils";
import { organizationNotificationsTablePath } from "@/app/dashboard/organizations/[organizationId]/manage/notifications/lib/notifications-table-params";
import { dateTimeOptions, formatDate } from "@/lib/format-date";
import { VisibilityBadge } from "@/components/globals-badge/visibility-badge";
import { UserProfileCell } from "@/components/user-profile/user-profile-cell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardTableShell } from "@/components/dashboard-table/dashboard-table-shell";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type NotificationsTableProps = {
  organizationId: string;
  notifications: OrganizationNotificationItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  feedback: { kind: "success" | "error"; message: string } | null;
  onView: (notification: OrganizationNotificationItem) => void;
  onCreate: () => void;
  onFeedback: (feedback: {
    kind: "success" | "error";
    message: string;
  }) => void;
};

export function NotificationsTable({
  organizationId,
  notifications,
  page,
  pageSize,
  totalCount,
  feedback,
  onView,
  onCreate,
  onFeedback,
}: NotificationsTableProps) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle>Notifications</CardTitle>
        <Button size="sm" onClick={onCreate}>
          <PlusIcon data-icon="inline-start" />
          New notification
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {feedback ? (
          <p
            className={
              feedback.kind === "error"
                ? "text-xs text-destructive"
                : "text-xs text-emerald-600"
            }
          >
            {feedback.message}
          </p>
        ) : null}

        {totalCount > 0 ? (
          <DashboardTableShell
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={(nextPage) =>
              router.push(
                organizationNotificationsTablePath(organizationId, {
                  page: nextPage,
                }),
              )
            }
            countLabel="notification"
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Audience</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Recipient
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">Sent</TableHead>
                    <TableHead className="text-end">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell className="max-w-56 sm:max-w-xs">
                        <p className="truncate font-medium leading-none">
                          {notification.title}
                        </p>
                        {notification.body ? (
                          <p className="mt-0.5 truncate text-[0.7rem] text-muted-foreground">
                            {notification.body}
                          </p>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <VisibilityBadge visibility={notification.audience} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {notification.userName ? (
                          <UserProfileCell
                            variant="compact"
                            user={{
                              name: notification.userName,
                              image: notification.userImage,
                            }}
                          />
                        ) : notification.teamName ? (
                          <span className="text-xs">
                            {notification.teamName}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="hidden text-xs text-muted-foreground lg:table-cell">
                        {formatDate(notification.createdAt, dateTimeOptions)}
                      </TableCell>
                      <TableCell className="text-end">
                        <NotificationRowActionsMenu
                          organizationId={organizationId}
                          notificationId={notification.id}
                          notificationTitle={notification.title}
                          onView={() => onView(notification)}
                          onDeleted={(message) =>
                            onFeedback({ kind: "success", message })
                          }
                          onError={(message) =>
                            onFeedback({ kind: "error", message })
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DashboardTableShell>
        ) : (
          <p className="py-8 text-center text-xs text-muted-foreground">
            No notifications yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
