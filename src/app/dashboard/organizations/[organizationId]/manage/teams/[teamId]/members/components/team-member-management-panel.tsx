"use client";

import { useState } from "react";
import { AddTeamMembersFormShell } from "@/app/dashboard/organizations/[organizationId]/manage/teams/[teamId]/members/components/add-team-members-form-shell";
import { TeamMembersTable } from "@/app/dashboard/organizations/[organizationId]/manage/teams/[teamId]/members/components/team-members-table";
import { TeamManageHeader } from "@/app/dashboard/organizations/[organizationId]/manage/teams/[teamId]/components/team-manage-header";
import type { OrganizationTeamMemberItem } from "@/app/dashboard/organizations/[organizationId]/manage/teams/[teamId]/members/lib/get-organization-team-members-page";

type TeamMemberManagementPanelProps = {
  organizationId: string;
  teamId: string;
  teamName: string;
  members: OrganizationTeamMemberItem[];
  page: number;
  pageSize: number;
  totalCount: number;
};

export function TeamMemberManagementPanel({
  organizationId,
  teamId,
  teamName,
  members,
  page,
  pageSize,
  totalCount,
}: TeamMemberManagementPanelProps) {
  const [feedback, setFeedback] = useState<{
    kind: "success" | "error";
    message: string;
  } | null>(null);
  const [addMembersOpen, setAddMembersOpen] = useState(false);

  const excludeUserIds = members.map((member) => member.userId);

  return (
    <div className="space-y-4">
      <TeamManageHeader organizationId={organizationId} teamName={teamName} />

      <TeamMembersTable
        organizationId={organizationId}
        teamId={teamId}
        members={members}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        feedback={feedback}
        onAddMembers={() => setAddMembersOpen(true)}
        onFeedback={setFeedback}
      />

      <AddTeamMembersFormShell
        organizationId={organizationId}
        teamId={teamId}
        open={addMembersOpen}
        excludeUserIds={excludeUserIds}
        onClose={() => setAddMembersOpen(false)}
        onFeedback={setFeedback}
      />
    </div>
  );
}
