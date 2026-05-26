"use client";

import { PlusIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteOrganizationInvitationAction } from "@/app/action/dashboard/organizations/manage/invitations/delete-organization-invitation-action";
import { toast } from "sonner";
import { InvitationRowActionsMenu } from "@/app/dashboard/organizations/[organizationId]/manage/invitations/components/invitation-row-actions-menu";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import { resolveInvitationJoinScope } from "@/app/join/lib/invitation-scope";
import {
  getInvitationContactLabel,
  type OrganizationInvitationItem,
} from "@/app/dashboard/organizations/[organizationId]/manage/invitations/lib/invitation-form-utils";
import { organizationInvitationsTablePath } from "@/app/dashboard/organizations/[organizationId]/manage/invitations/lib/invitations-table-params";
import { dateTimeOptions, formatDate } from "@/lib/format-date";
import { formatInvitationUsageLabel } from "@/lib/badge/invitation-display-status";
import { InvitationDisplayStatusBadge } from "@/components/badge/invitation-display-status-badge";
import { InvitationJoinScopeBadge } from "@/components/badge/invitation-join-scope-badge";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTableShell } from "@/components/data-table/data-table-shell";
import { DataTableViewport } from "@/components/data-table/data-table-viewport";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type InvitationsTableProps = {
  organizationId: string;
  invitations: OrganizationInvitationItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  onView: (invitation: OrganizationInvitationItem) => void;
  onEdit: (invitation: OrganizationInvitationItem) => void;
  onCreate: () => void;
};

function InvitationDestinationCell({
  invitation,
  joinScope,
}: {
  invitation: OrganizationInvitationItem;
  joinScope: ReturnType<typeof resolveInvitationJoinScope>;
}) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-1">
      <InvitationJoinScopeBadge scope={joinScope} />
      {invitation.teamName ? (
        <span
          className="block max-w-full truncate text-[0.7rem] text-muted-foreground"
          title={invitation.teamName}
        >
          {invitation.teamName}
        </span>
      ) : null}
    </div>
  );
}

export function InvitationsTable({
  organizationId,
  invitations,
  page,
  pageSize,
  totalCount,
  onView,
  onEdit,
  onCreate,
}: InvitationsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] =
    useState<OrganizationInvitationItem | null>(null);

  const handleDelete = () => {
    if (!deleteTarget) {
      return;
    }

    startTransition(async () => {
      const result = await deleteOrganizationInvitationAction({
        organizationId,
        invitationId: deleteTarget.id,
      });

      if (!result.success) {
        toast.error(result.error ?? "Could not delete the invitation.");
        return;
      }

      setDeleteTarget(null);
      toast.success("Invitation deleted.");
      router.refresh();
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle>Invitations</CardTitle>
        <Button size="sm" onClick={onCreate}>
          <PlusIcon data-icon="inline-start" />
          Create invitation
        </Button>
      </CardHeader>
      <CardContent>
        {totalCount > 0 ? (
          <DataTableShell
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={(nextPage) =>
              router.push(
                organizationInvitationsTablePath(organizationId, {
                  page: nextPage,
                  pageSize,
                }),
              )
            }
            onPageSizeChange={(nextPageSize) =>
              router.push(
                organizationInvitationsTablePath(organizationId, {
                  page: 1,
                  pageSize: nextPageSize,
                }),
              )
            }
            countLabel="invitation"
          >
            <DataTableViewport>
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-0 whitespace-normal">
                      Invitation
                    </TableHead>
                    <TableHead className="hidden min-w-0 whitespace-normal lg:table-cell">
                      Destination
                    </TableHead>
                    <TableHead className="hidden min-w-0 whitespace-normal lg:table-cell">
                      Status
                    </TableHead>
                    <TableHead className="hidden whitespace-normal lg:table-cell">
                      Expires
                    </TableHead>
                    <TableHead className="w-12 whitespace-normal">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map((invitation) => {
                    const joinScope = resolveInvitationJoinScope({
                      organizationId: invitation.organizationId,
                      teamId: invitation.teamId,
                    });

                    return (
                      <TableRow key={invitation.id}>
                        <TableCell className="min-w-0 whitespace-normal">
                          <p className="truncate font-medium leading-none">
                            {getInvitationContactLabel()}
                          </p>
                          <p
                            className="mt-0.5 truncate text-[0.7rem] text-muted-foreground"
                            title={formatInvitationUsageLabel(
                              invitation.usedCount,
                              invitation.maxUses,
                            )}
                          >
                            {formatInvitationUsageLabel(
                              invitation.usedCount,
                              invitation.maxUses,
                            )}
                          </p>
                          <div className="mt-1.5 space-y-1 lg:hidden">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <InvitationJoinScopeBadge scope={joinScope} />
                              <InvitationDisplayStatusBadge
                                invitation={invitation}
                              />
                            </div>
                            {invitation.teamName ? (
                              <p
                                className="truncate text-[0.7rem] text-muted-foreground"
                                title={invitation.teamName}
                              >
                                {invitation.teamName}
                              </p>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell className="hidden min-w-0 whitespace-normal lg:table-cell">
                          <InvitationDestinationCell
                            invitation={invitation}
                            joinScope={joinScope}
                          />
                        </TableCell>
                        <TableCell className="hidden whitespace-normal lg:table-cell">
                          <InvitationDisplayStatusBadge
                            invitation={invitation}
                          />
                        </TableCell>
                        <TableCell className="hidden text-xs text-muted-foreground lg:table-cell">
                          {formatDate(invitation.expiresAt, dateTimeOptions)}
                        </TableCell>
                        <TableCell className="w-12 whitespace-normal">
                          <InvitationRowActionsMenu
                            invitation={invitation}
                            disabled={isPending}
                            onView={() => onView(invitation)}
                            onEdit={() => onEdit(invitation)}
                            onDelete={() => setDeleteTarget(invitation)}
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
            No invitations yet.
          </p>
        )}
      </CardContent>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dashboardNavLabels.invitationManage.deleteTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dashboardNavLabels.invitationManage.deleteDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isPending}
              onClick={handleDelete}
            >
              {dashboardNavLabels.invitationManage.deleteConfirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
