"use client";

import { BellDotIcon, MailOpenIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type { UserNotificationListItem } from "@/app/dashboard/(user)/notifications/lib/get-user-notifications-page";
import {
  userNotificationFilterLabels,
  userNotificationsTablePath,
  type UserNotificationTableFilter,
} from "@/app/dashboard/(user)/notifications/lib/user-notifications-table-params";
import { buildNotificationSourceInline } from "@/app/dashboard/lib/notifications/notification-source-label";
import { dateTimeOptions, formatDate } from "@/lib/format-date";
import { badgeLabels } from "@/lib/badge/badge-labels";
import type { NotificationType } from "@/generated/prisma/enums";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTableSegmentFilter } from "@/components/data-table/data-table-segment-filter";
import { DataTableShell } from "@/components/data-table/data-table-shell";
import { UserNotificationRowActionsMenu } from "@/app/dashboard/(user)/notifications/components/user-notification-row-actions-menu";
import { DataTableViewport } from "@/components/data-table/data-table-viewport";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type UserNotificationsTableProps = {
  isOwnInbox: boolean;
  notifications: UserNotificationListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  filter: UserNotificationTableFilter;
  onView: (notification: UserNotificationListItem) => void;
};

function getNotificationTypeLabel(type: NotificationType | string): string {
  if (type in badgeLabels.notificationType) {
    return badgeLabels.notificationType[type as NotificationType];
  }

  return badgeLabels.fallback;
}

function formatNotificationMetaDate(
  notification: UserNotificationListItem,
  filter: UserNotificationTableFilter,
): string {
  const date =
    filter === "read" && notification.readAt
      ? notification.readAt
      : notification.createdAt;

  return formatDate(date, dateTimeOptions);
}

export function UserNotificationsTable({
  isOwnInbox,
  notifications,
  page,
  pageSize,
  totalCount,
  filter,
  onView,
}: UserNotificationsTableProps) {
  const router = useRouter();

  const navigate = (input: {
    page?: number;
    pageSize?: number;
    filter?: UserNotificationTableFilter;
  }) => {
    router.push(
      userNotificationsTablePath({
        page: input.page,
        pageSize: input.pageSize ?? pageSize,
        filter: input.filter ?? filter,
      }),
    );
  };

  const emptyMessage =
    filter === "unread"
      ? isOwnInbox
        ? "You have no unread notifications."
        : "This user has no unread notifications."
      : isOwnInbox
        ? "You have no read notifications."
        : "This user has no read notifications.";

  const notificationFilterOptions = [
    {
      value: "unread" as const,
      label: userNotificationFilterLabels.unread,
      icon: BellDotIcon,
    },
    {
      value: "read" as const,
      label: userNotificationFilterLabels.read,
      icon: MailOpenIcon,
    },
  ];

  const dateColumnLabel = filter === "read" ? "Read" : "Sent";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardAction>
          <DataTableSegmentFilter
            value={filter}
            options={notificationFilterOptions}
            onValueChange={(next) => navigate({ page: 1, filter: next })}
          />
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        {totalCount > 0 ? (
          <DataTableShell
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={(nextPage) => navigate({ page: nextPage })}
            onPageSizeChange={(nextPageSize) =>
              navigate({ page: 1, pageSize: nextPageSize })
            }
            countLabel="notification"
          >
            <DataTableViewport>
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-0 whitespace-normal">
                      Title
                    </TableHead>
                    <TableHead className="hidden whitespace-normal lg:table-cell">
                      {dateColumnLabel}
                    </TableHead>
                    <TableHead className="w-12 whitespace-normal">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notification) => {
                    const typeLabel = getNotificationTypeLabel(
                      notification.type,
                    );
                    const sourceLabel =
                      buildNotificationSourceInline({
                        organizationName: notification.organizationName ?? null,
                        teamName: notification.teamName ?? null,
                        createdByName: null,
                      }) ?? "â€”";
                    const formattedDate = formatNotificationMetaDate(
                      notification,
                      filter,
                    );
                    const metaLine = `${typeLabel} Â· ${sourceLabel} Â· ${formattedDate}`;

                    return (
                      <TableRow
                        key={notification.id}
                        className="cursor-pointer"
                        onClick={() => onView(notification)}
                      >
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
                          <p
                            className="mt-1 truncate text-[0.7rem] text-muted-foreground lg:hidden"
                            title={metaLine}
                          >
                            {metaLine}
                          </p>
                          <p
                            className="mt-1 hidden truncate text-[0.7rem] text-muted-foreground lg:block"
                            title={`${typeLabel} Â· ${sourceLabel}`}
                          >
                            {typeLabel} Â· {sourceLabel}
                          </p>
                        </TableCell>
                        <TableCell className="hidden text-xs text-muted-foreground lg:table-cell">
                          {formattedDate}
                        </TableCell>
                        <TableCell
                          className="w-12 whitespace-normal"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <UserNotificationRowActionsMenu
                            notificationTitle={notification.title}
                            onView={() => onView(notification)}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </DataTableViewport>
          </DataTableShell>
        ) : (
          <p className="py-8 text-center text-xs text-muted-foreground">
            {emptyMessage}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
