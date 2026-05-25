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
import { DashboardTableViewport } from "@/components/dashboard-table/dashboard-table-viewport";
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
  onView: (notification: OrganizationNotificationItem) => void;
  onCreate: () => void;
};

export function NotificationsTable({
  organizationId,
  notifications,
  page,
  pageSize,
  totalCount,
  onView,
  onCreate,
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
      <CardContent>
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
            <DashboardTableViewport>
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-0 whitespace-normal">
                      Title
                    </TableHead>
                    <TableHead className="whitespace-normal">
                      Audience
                    </TableHead>
                    <TableHead className="hidden min-w-0 whitespace-normal md:table-cell">
                      Recipient
                    </TableHead>
                    <TableHead className="hidden whitespace-normal lg:table-cell">
                      Sent
                    </TableHead>
                    <TableHead className="w-12 whitespace-normal">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell className="min-w-0 whitespace-normal">
                        <p
                          className="truncate font-medium leading-none"
                          title={notification.title}
                        >
                          {notification.title}
                        </p>
                        {notification.body ? (
                          <p
                            className="mt-0.5 truncate text-[0.7rem] text-muted-foreground"
                            title={notification.body}
                          >
                            {notification.body}
                          </p>
                        ) : null}
                      </TableCell>
                      <TableCell className="whitespace-normal">
                        <VisibilityBadge visibility={notification.audience} />
                      </TableCell>
                      <TableCell className="hidden min-w-0 whitespace-normal md:table-cell">
                        {notification.userName ? (
                          <UserProfileCell
                            variant="compact"
                            user={{
                              name: notification.userName,
                              image: notification.userImage,
                            }}
                          />
                        ) : notification.teamName ? (
                          <span
                            className="block truncate text-xs"
                            title={notification.teamName}
                          >
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
                      <TableCell className="w-12 whitespace-normal">
                        <NotificationRowActionsMenu
                          organizationId={organizationId}
                          notificationId={notification.id}
                          notificationTitle={notification.title}
                          onView={() => onView(notification)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DashboardTableViewport>
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
