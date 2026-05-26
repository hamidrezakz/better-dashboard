"use client";

import { formatDate } from "@/lib/format-date";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { removeOrganizationMemberAction } from "@/app/action/dashboard/organizations/manage/members/remove-organization-member-action";
import { MemberRowActionsMenu } from "@/app/dashboard/organizations/[organizationId]/manage/members/components/member-row-actions-menu";
import { toast } from "sonner";
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
import { DataTableSegmentFilter } from "@/components/data-table/data-table-segment-filter";
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
import { RoleBadge } from "@/components/badge/role-badge";
import { UserProfileCell } from "@/components/user-profile/user-profile-cell";

type MembersTableProps = {
  organizationId: string;
  members: OrganizationMemberItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  filter: MemberTableFilter;
  actorUserId: string;
  onChangeRole: (member: OrganizationMemberItem) => void;
  onManageTeams: (member: OrganizationMemberItem) => void;
};

export function MembersTable({
  organizationId,
  members,
  page,
  pageSize,
  totalCount,
  filter,
  actorUserId,
  onChangeRole,
  onManageTeams,
}: MembersTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [removeTarget, setRemoveTarget] =
    useState<OrganizationMemberItem | null>(null);

  const navigate = (input: {
    page?: number;
    pageSize?: number;
    filter?: MemberTableFilter;
  }) => {
    router.push(
      organizationMembersTablePath(organizationId, {
        page: input.page,
        pageSize: input.pageSize ?? pageSize,
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
        toast.error(result.error ?? "Could not remove the member.");
        return;
      }

      setRemoveTarget(null);
      toast.success("Member removed from the organization.");
      router.refresh();
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
        <CardAction>
          <DataTableSegmentFilter
            value={filter}
            options={memberFilterOptions}
            onValueChange={(next) => navigate({ page: 1, filter: next })}
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
          countLabel="member"
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
                  <TableHead className="w-24 whitespace-normal">Role</TableHead>
                  <TableHead className="hidden whitespace-normal lg:table-cell">
                    Joined
                  </TableHead>
                  <TableHead className="w-12 whitespace-normal">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.length ? (
                  members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="min-w-0 whitespace-normal">
                        <UserProfileCell
                          variant="inline"
                          user={{
                            name: member.name,
                            email: member.email,
                            image: member.image,
                          }}
                        />
                      </TableCell>
                      <TableCell className="hidden min-w-0 whitespace-normal text-muted-foreground sm:table-cell">
                        <span className="block truncate" title={member.email}>
                          {member.email}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-normal">
                        <RoleBadge role={member.role} />
                      </TableCell>
                      <TableCell className="hidden whitespace-normal lg:table-cell">
                        {formatDate(member.joinedAt)}
                      </TableCell>
                      <TableCell className="w-12 whitespace-normal">
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
          </DataTableViewport>
        </DataTableShell>
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
                ? `${removeTarget.name} will lose organization membership and management access. Team memberships in this organization are kept unless removed separately.`
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
