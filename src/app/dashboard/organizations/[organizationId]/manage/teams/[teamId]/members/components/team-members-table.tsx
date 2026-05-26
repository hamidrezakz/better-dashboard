"use client";

import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { TeamMemberRowActionsMenu } from "@/app/dashboard/organizations/[organizationId]/manage/teams/[teamId]/members/components/team-member-row-actions-menu";
import { organizationTeamMembersTablePath } from "@/app/dashboard/organizations/[organizationId]/manage/teams/[teamId]/members/lib/team-members-table-params";
import type { OrganizationTeamMemberItem } from "@/app/dashboard/organizations/[organizationId]/manage/teams/[teamId]/members/lib/get-organization-team-members-page";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import { formatDate } from "@/lib/format-date";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { UserProfileCell } from "@/components/user-profile/user-profile-cell";

type TeamMembersTableProps = {
  organizationId: string;
  teamId: string;
  members: OrganizationTeamMemberItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  onAddMembers: () => void;
};

export function TeamMembersTable({
  organizationId,
  teamId,
  members,
  page,
  pageSize,
  totalCount,
  onAddMembers,
}: TeamMembersTableProps) {
  const router = useRouter();

  const navigate = (input: { page?: number; pageSize?: number }) => {
    router.push(
      organizationTeamMembersTablePath(organizationId, teamId, {
        page: input.page,
        pageSize: input.pageSize ?? pageSize,
      }),
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
        <CardAction>
          <Button type="button" size="sm" onClick={onAddMembers}>
            <PlusIcon />
            {dashboardNavLabels.teamManage.addMembers}
          </Button>
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
                  <TableHead className="hidden whitespace-normal md:table-cell">
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
                      <TableCell className="hidden whitespace-normal md:table-cell">
                        {formatDate(member.joinedAt)}
                      </TableCell>
                      <TableCell className="w-12 whitespace-normal">
                        <TeamMemberRowActionsMenu
                          organizationId={organizationId}
                          teamId={teamId}
                          member={member}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-6 text-center text-muted-foreground"
                    >
                      No team members yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DataTableViewport>
        </DataTableShell>
      </CardContent>
    </Card>
  );
}
