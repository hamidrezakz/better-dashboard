"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { banUserAction } from "@/app/action/dashboard/admin/users/ban-user-action";
import { unbanUserAction } from "@/app/action/dashboard/admin/users/unban-user-action";
import { AdminUserRowActionsMenu } from "@/app/dashboard/admin/users/components/admin-user-row-actions-menu";
import type { AdminUserItem } from "@/app/dashboard/admin/users/lib/get-admin-users-page";
import {
  adminUserFilterLabels,
  adminUsersTablePath,
  type AdminUserTableFilter,
} from "@/app/dashboard/admin/users/lib/admin-users-table-params";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import { PlatformRoleBadge } from "@/components/badge/platform-role-badge";
import { UserAccountStatusBadge } from "@/components/badge/user-account-status-badge";
import { DataTableSearchField } from "@/components/data-table/data-table-search-field";
import { DataTableSegmentFilter } from "@/components/data-table/data-table-segment-filter";
import { DataTableShell } from "@/components/data-table/data-table-shell";
import { DataTableViewport } from "@/components/data-table/data-table-viewport";
import { UserProfileCell } from "@/components/user-profile/user-profile-cell";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format-date";
import { toast } from "sonner";

type AdminUsersTableProps = {
  users: AdminUserItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  filter: AdminUserTableFilter;
  q?: string;
  actorUserId: string;
  onChangeRole: (user: AdminUserItem) => void;
};

export function AdminUsersTable({
  users,
  page,
  pageSize,
  totalCount,
  filter,
  q,
  actorUserId,
  onChangeRole,
}: AdminUsersTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [banTarget, setBanTarget] = useState<AdminUserItem | null>(null);

  const navigate = (input: {
    page?: number;
    pageSize?: number;
    filter?: AdminUserTableFilter;
    q?: string;
  }) => {
    router.push(
      adminUsersTablePath({
        page: input.page,
        pageSize: input.pageSize ?? pageSize,
        filter: input.filter ?? filter,
        q: input.q !== undefined ? input.q : q,
      }),
    );
  };

  const buildSearchPath = useCallback(
    (input: { q?: string; page?: number }) =>
      adminUsersTablePath({
        page: input.page ?? 1,
        pageSize,
        filter,
        q: input.q,
      }),
    [filter, pageSize],
  );

  const filterOptions = (["all", "admins", "users", "banned"] as const).map(
    (value) => ({
      value,
      label: adminUserFilterLabels[value],
    }),
  );

  const handleBan = () => {
    if (!banTarget) {
      return;
    }

    startTransition(async () => {
      const result = await banUserAction({ userId: banTarget.id });

      if (!result.success) {
        toast.error(result.error ?? "Could not ban the user.");
        return;
      }

      setBanTarget(null);
      toast.success("User banned.");
      router.refresh();
    });
  };

  const handleUnban = (user: AdminUserItem) => {
    startTransition(async () => {
      const result = await unbanUserAction({ userId: user.id });

      if (!result.success) {
        toast.error(result.error ?? "Could not unban the user.");
        return;
      }

      toast.success("User unbanned.");
      router.refresh();
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>{dashboardNavLabels.adminTabs.users}</CardTitle>
        <CardAction className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <DataTableSearchField
            query={q}
            placeholder="Search by name or email…"
            buildPath={buildSearchPath}
          />
          <DataTableSegmentFilter
            value={filter}
            options={filterOptions}
            onValueChange={(next) =>
              navigate({ page: 1, filter: next as AdminUserTableFilter })
            }
          />
        </CardAction>
      </CardHeader>

      <CardContent>
        <DataTableShell
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={(nextPage) => navigate({ page: nextPage })}
          onPageSizeChange={(nextPageSize) =>
            navigate({ page: 1, pageSize: nextPageSize })
          }
          countLabel="user"
        >
          <DataTableViewport>
            <Table className="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-0 whitespace-normal">
                    Name
                  </TableHead>
                  <TableHead className="hidden min-w-0 whitespace-normal sm:table-cell">
                    Email
                  </TableHead>
                  <TableHead className="w-32 whitespace-normal">Role</TableHead>
                  <TableHead className="w-24 whitespace-normal">
                    Status
                  </TableHead>
                  <TableHead className="hidden whitespace-normal lg:table-cell">
                    Joined
                  </TableHead>
                  <TableHead className="w-12 whitespace-normal">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="min-w-0 whitespace-normal">
                        <UserProfileCell
                          variant="inline"
                          user={{
                            name: user.name,
                            email: user.email,
                            image: user.image,
                          }}
                        />
                      </TableCell>
                      <TableCell className="hidden min-w-0 whitespace-normal text-muted-foreground sm:table-cell">
                        <span className="block truncate" title={user.email}>
                          {user.email}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-normal">
                        <PlatformRoleBadge role={user.role} />
                      </TableCell>
                      <TableCell className="whitespace-normal">
                        <UserAccountStatusBadge banned={user.banned} />
                      </TableCell>
                      <TableCell className="hidden whitespace-normal lg:table-cell">
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell className="w-12 whitespace-normal">
                        <AdminUserRowActionsMenu
                          user={user}
                          disabled={isPending}
                          isSelf={user.id === actorUserId}
                          onChangeRole={() => onChangeRole(user)}
                          onBan={() => setBanTarget(user)}
                          onUnban={() => handleUnban(user)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-6 text-center text-muted-foreground"
                    >
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DataTableViewport>
        </DataTableShell>
      </CardContent>

      <AlertDialog
        open={Boolean(banTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setBanTarget(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dashboardNavLabels.adminUserManage.banTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {banTarget
                ? `${banTarget.name} — ${dashboardNavLabels.adminUserManage.banDescription}`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isPending}
              onClick={handleBan}
            >
              {dashboardNavLabels.adminUserManage.banConfirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
