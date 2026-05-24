"use client";

import { useRouter } from "next/navigation";
import type { UserNotificationListItem } from "@/app/dashboard/(user)/notifications/lib/get-user-notifications-page";
import {
  userNotificationFilterLabels,
  userNotificationsTablePath,
  type UserNotificationTableFilter,
} from "@/app/dashboard/(user)/notifications/lib/user-notifications-table-params";
import { dateTimeOptions, formatDate } from "@/lib/format-date";
import { RequestStatusBadge } from "@/components/globals-badge/request-status-badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardTableSegmentFilter } from "@/components/dashboard-table/dashboard-table-segment-filter";
import { DashboardTableShell } from "@/components/dashboard-table/dashboard-table-shell";
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
    filter?: UserNotificationTableFilter;
  }) => {
    router.push(
      userNotificationsTablePath({
        page: input.page,
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
    { value: "unread" as const, label: userNotificationFilterLabels.unread },
    { value: "read" as const, label: userNotificationFilterLabels.read },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardAction>
          <DashboardTableSegmentFilter
            value={filter}
            options={notificationFilterOptions}
            onValueChange={(next) => navigate({ page: 1, filter: next })}
          />
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        {totalCount > 0 ? (
          <DashboardTableShell
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={(nextPage) => navigate({ page: nextPage })}
            countLabel="notification"
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden sm:table-cell">Type</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Source
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      {filter === "read" ? "Read" : "Sent"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notification) => (
                    <TableRow
                      key={notification.id}
                      className="cursor-pointer"
                      onClick={() => onView(notification)}
                    >
                      <TableCell>
                        <p className="max-w-xs truncate font-medium leading-none sm:max-w-sm">
                          {notification.title}
                        </p>
                        {notification.body ? (
                          <p className="mt-0.5 max-w-xs truncate text-[0.7rem] text-muted-foreground sm:max-w-sm">
                            {notification.body}
                          </p>
                        ) : null}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <RequestStatusBadge status={notification.type} />
                      </TableCell>
                      <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                        {notification.sourceLabel ? (
                          <span
                            className="block max-w-48 truncate"
                            title={notification.sourceLabel}
                          >
                            {notification.sourceLabel}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden text-xs text-muted-foreground lg:table-cell">
                        {formatDate(
                          filter === "read" && notification.readAt
                            ? notification.readAt
                            : notification.createdAt,
                          dateTimeOptions,
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DashboardTableShell>
        ) : (
          <p className="py-8 text-center text-xs text-muted-foreground">
            {emptyMessage}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
