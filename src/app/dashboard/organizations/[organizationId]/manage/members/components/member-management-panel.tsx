"use client";

import { useState } from "react";
import { MemberRoleFormShell } from "@/app/dashboard/organizations/[organizationId]/manage/members/components/member-role-form-shell";
// TEAMS_SLICE: remove MemberTeamsFormShell and teamsMember state when trimming teams
import { MemberTeamsFormShell } from "@/app/dashboard/organizations/[organizationId]/manage/members/components/member-teams-form-shell";
import { MembersTable } from "@/app/dashboard/organizations/[organizationId]/manage/members/components/members-table";
import type { OrganizationMemberItem } from "@/app/dashboard/organizations/[organizationId]/manage/members/lib/get-organization-members-page";
import type { MemberTableFilter } from "@/app/dashboard/organizations/[organizationId]/manage/members/lib/members-table-params";
import type { MembershipRole } from "@/generated/prisma/enums";

type MemberManagementPanelProps = {
  organizationId: string;
  members: OrganizationMemberItem[];
  teams: Array<{ id: string; name: string }>;
  page: number;
  pageSize: number;
  totalCount: number;
  filter: MemberTableFilter;
  actorUserId: string;
  actorRole: MembershipRole | null;
};

export function MemberManagementPanel({
  organizationId,
  members,
  teams,
  page,
  pageSize,
  totalCount,
  filter,
  actorUserId,
  actorRole,
}: MemberManagementPanelProps) {
  const [roleMember, setRoleMember] = useState<OrganizationMemberItem | null>(
    null,
  );
  const [teamsMember, setTeamsMember] = useState<OrganizationMemberItem | null>(
    null,
  );

  return (
    <div className="space-y-4">
      <MembersTable
        organizationId={organizationId}
        members={members}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        filter={filter}
        actorUserId={actorUserId}
        onChangeRole={setRoleMember}
        onManageTeams={setTeamsMember}
      />

      <MemberRoleFormShell
        organizationId={organizationId}
        member={roleMember}
        actorRole={actorRole}
        open={Boolean(roleMember)}
        onClose={() => setRoleMember(null)}
      />

      <MemberTeamsFormShell
        organizationId={organizationId}
        member={teamsMember}
        teams={teams}
        open={Boolean(teamsMember)}
        onClose={() => setTeamsMember(null)}
      />
    </div>
  );
}
