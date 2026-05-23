"use client";

import { formatDate } from "@/lib/format-date";
import { useRouter } from "next/navigation";
import type { OrganizationMemberItem } from "@/app/dashboard/organizations/[organizationId]/manage/members/lib/get-organization-members-page";
import {
  memberFilterLabels,
  organizationMembersTablePath,
  type MemberTableFilter,
} from "@/app/dashboard/organizations/[organizationId]/manage/members/lib/members-table-params";
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
};

export function MembersTable({
  organizationId,
  members,
  page,
  pageSize,
  totalCount,
  filter,
}: MembersTableProps) {
  const router = useRouter();

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
                <TableHead className="hidden md:table-cell">Teams</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Joined
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
                      {member.email}
                    </TableCell>
                    <TableCell>
                      <RoleBadge role={member.role} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {member.teamCount}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {formatDate(member.joinedAt)}
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
    </Card>
  );
}
