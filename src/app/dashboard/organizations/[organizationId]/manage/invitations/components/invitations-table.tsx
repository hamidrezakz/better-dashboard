"use client";

import { PlusIcon } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteOrganizationInvitationAction } from "@/app/action/dashboard/organizations/manage/invitations/delete-organization-invitation-action";
import { InvitationRowActionsMenu } from "@/app/dashboard/organizations/[organizationId]/manage/invitations/components/invitation-row-actions-menu";
import { resolveInvitationJoinScope } from "@/app/join/lib/invitation-scope";
import {
  getInvitationContactLabel,
  type OrganizationInvitationItem,
} from "@/app/dashboard/organizations/[organizationId]/manage/invitations/lib/invitation-form-utils";
import { organizationInvitationsTablePath } from "@/app/dashboard/organizations/[organizationId]/manage/invitations/lib/invitations-table-params";
import { dateTimeOptions, formatDate } from "@/lib/format-date";
import { formatInvitationUsageLabel } from "@/lib/invitation-display-status";
import { InvitationDisplayStatusBadge } from "@/components/globals-badge/invitation-display-status-badge";
import { InvitationJoinScopeBadge } from "@/components/globals-badge/invitation-join-scope-badge";
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

type InvitationsTableProps = {
  organizationId: string;
  invitations: OrganizationInvitationItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  feedback: { kind: "success" | "error"; message: string } | null;
  onView: (invitation: OrganizationInvitationItem) => void;
  onEdit: (invitation: OrganizationInvitationItem) => void;
  onCreate: () => void;
  onFeedback: (feedback: {
    kind: "success" | "error";
    message: string;
  }) => void;
};

export function InvitationsTable({
  organizationId,
  invitations,
  page,
  pageSize,
  totalCount,
  feedback,
  onView,
  onEdit,
  onCreate,
  onFeedback,
}: InvitationsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = (invitationId: string) => {
    startTransition(async () => {
      const result = await deleteOrganizationInvitationAction({
        organizationId,
        invitationId,
      });

      if (!result.success) {
        onFeedback({
          kind: "error",
          message: result.error ?? "Could not delete the invitation.",
        });
        return;
      }

      onFeedback({
        kind: "success",
        message: "Invitation deleted.",
      });
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
                organizationInvitationsTablePath(organizationId, {
                  page: nextPage,
                }),
              )
            }
            countLabel="invitation"
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invitation</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Expires
                    </TableHead>
                    <TableHead className="text-end">Actions</TableHead>
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
                        <TableCell>
                          <p className="font-medium leading-none">
                            {getInvitationContactLabel()}
                          </p>
                          <p className="mt-0.5 text-[0.7rem] text-muted-foreground">
                            {formatInvitationUsageLabel(
                              invitation.usedCount,
                              invitation.maxUses,
                            )}
                            {" · "}
                            {`Created by: ${invitation.inviterName}`}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col items-start gap-1">
                            <InvitationJoinScopeBadge scope={joinScope} />
                            {invitation.teamName ? (
                              <span className="text-[0.7rem] text-muted-foreground">
                                {invitation.teamName}
                              </span>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell>
                          <InvitationDisplayStatusBadge
                            invitation={invitation}
                          />
                        </TableCell>
                        <TableCell className="hidden text-xs text-muted-foreground lg:table-cell">
                          {formatDate(invitation.expiresAt, dateTimeOptions)}
                        </TableCell>
                        <TableCell className="text-end">
                          <InvitationRowActionsMenu
                            invitation={invitation}
                            disabled={isPending}
                            onView={() => onView(invitation)}
                            onEdit={() => onEdit(invitation)}
                            onDelete={() => handleDelete(invitation.id)}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </DashboardTableShell>
        ) : (
          <p className="py-8 text-center text-xs text-muted-foreground">
            No invitations yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
