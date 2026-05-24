"use client";

import { formatDate } from "@/lib/format-date";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { removeOrganizationMemberAction } from "@/app/action/dashboard/organizations/manage/members/remove-organization-member-action";
import { MemberRowActionsMenu } from "@/app/dashboard/organizations/[organizationId]/manage/members/components/member-row-actions-menu";
import type { OrganizationMemberItem } from "@/app/dashboard/organizations/[organizationId]/manage/members/lib/get-organization-members-page";
import {
  memberFilterLabels,
  organizationMembersTablePath,
  type MemberTableFilter,
} from "@/app/dashboard/organizations/[organizationId]/manage/members/lib/members-table-params";
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
import { RoleBadge } from "@/components/globals-badge/role-badge";
import { UserProfileCell } from "@/components/user-profile/user-profile-cell";

type MembersTableProps = {
  organizationId: string;
  members: OrganizationMemberItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  filter: MemberTableFilter;
  actorUserId: string;
  feedback: { kind: "success" | "error"; message: string } | null;
  onChangeRole: (member: OrganizationMemberItem) => void;
  onManageTeams: (member: OrganizationMemberItem) => void;
  onFeedback: (
    feedback: { kind: "success" | "error"; message: string } | null,
  ) => void;
};

export function MembersTable({
  organizationId,
  members,
  page,
  pageSize,
  totalCount,
  filter,
  actorUserId,
  feedback,
  onChangeRole,
  onManageTeams,
  onFeedback,
}: MembersTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [removeTarget, setRemoveTarget] =
    useState<OrganizationMemberItem | null>(null);

  const navigate = (input: { page?: number; filter?: MemberTableFilter }) => {
    router.push(
      organizationMembersTablePath(organizationId, {
        page: input.page,
        filter: input.filter ?? filter,
      }),
    );
  };

  const memberFilterOptions = (["all", "managers", "members"] as const).map(
    (value) => ({
      value,
      label: memberFilterLabels[value],
    }),
  );

  const handleRemove = () => {
    if (!removeTarget) {
      return;
    }

    startTransition(async () => {
      const result = await removeOrganizationMemberAction({
        organizationId,
        memberId: removeTarget.id,
      });

      if (!result.success) {
        onFeedback({
          kind: "error",
          message: result.error ?? "Could not remove the member.",
        });
        return;
      }

      setRemoveTarget(null);
      onFeedback({
        kind: "success",
        message: "Member removed from the organization.",
      });
      router.refresh();
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
        <CardAction>
          <DashboardTableSegmentFilter
            value={filter}
            options={memberFilterOptions}
            onValueChange={(next) => navigate({ page: 1, filter: next })}
          />
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        {feedback ? (
          <p
            className={
              feedback.kind === "error"
                ? "text-sm text-destructive"
                : "text-sm text-muted-foreground"
            }
          >
            {feedback.message}
          </p>
        ) : null}

        <DashboardTableShell
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={(nextPage) => navigate({ page: nextPage })}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden lg:table-cell">Joined</TableHead>
                <TableHead className="w-12">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.length ? (
                members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <UserProfileCell
                        user={{
                          name: member.name,
                          email: member.email,
                          image: member.image,
                        }}
                      />
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">
                      <span
                        className="block max-w-md truncate"
                        title={member.email}
                      >
                        {member.email}
                      </span>
                    </TableCell>
                    <TableCell>
                      <RoleBadge role={member.role} />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {formatDate(member.joinedAt)}
                    </TableCell>
                    <TableCell>
                      <MemberRowActionsMenu
                        member={member}
                        disabled={isPending}
                        canRemove={member.userId !== actorUserId}
                        onChangeRole={() => onChangeRole(member)}
                        onManageTeams={() => onManageTeams(member)}
                        onRemove={() => setRemoveTarget(member)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-6 text-center text-muted-foreground"
                  >
                    No members yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DashboardTableShell>
      </CardContent>

      <AlertDialog
        open={Boolean(removeTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setRemoveTarget(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from organization</AlertDialogTitle>
            <AlertDialogDescription>
              {removeTarget
                ? `${removeTarget.name} will lose access to this organization and its teams. This cannot be undone.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isPending}
              onClick={handleRemove}
            >
              Remove member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
