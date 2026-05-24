"use client";

import { useState } from "react";
import {
  TeamFormShell,
  type TeamFormShellTarget,
} from "@/app/dashboard/organizations/[organizationId]/manage/teams/components/team-form-shell";
import { OutsiderTeamMembersTable } from "@/app/dashboard/organizations/[organizationId]/manage/teams/components/outsider-team-members-table";
import { TeamsTable } from "@/app/dashboard/organizations/[organizationId]/manage/teams/components/teams-table";
import type {
  OrganizationOutsiderTeamMemberItem,
  OrganizationTeamItem,
} from "@/app/dashboard/organizations/[organizationId]/manage/teams/lib/team-form-utils";

type TeamFeedback = {
  kind: "success" | "error";
  message: string;
};

type TeamManagementPanelProps = {
  organizationId: string;
  teams: OrganizationTeamItem[];
  outsiderTeamMembers: OrganizationOutsiderTeamMemberItem[];
};

export function TeamManagementPanel({
  organizationId,
  teams,
  outsiderTeamMembers,
}: TeamManagementPanelProps) {
  const [feedback, setFeedback] = useState<TeamFeedback | null>(null);
  const [formTarget, setFormTarget] = useState<TeamFormShellTarget | null>(
    null,
  );

  return (
    <div className="space-y-4">
      <TeamsTable
        organizationId={organizationId}
        teams={teams}
        feedback={feedback}
        onCreate={() => setFormTarget({ mode: "create" })}
        onEdit={(team) => setFormTarget({ mode: "edit", team })}
        onFeedback={setFeedback}
      />

      <OutsiderTeamMembersTable items={outsiderTeamMembers} />

      <TeamFormShell
        organizationId={organizationId}
        target={formTarget}
        onClose={() => setFormTarget(null)}
        onFeedback={setFeedback}
      />
    </div>
  );
}
