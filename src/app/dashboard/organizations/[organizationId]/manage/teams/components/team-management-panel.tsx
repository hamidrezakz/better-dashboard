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
  const [formTarget, setFormTarget] = useState<TeamFormShellTarget | null>(
    null,
  );

  return (
    <div className="space-y-4">
      <TeamsTable
        organizationId={organizationId}
        teams={teams}
        onCreate={() => setFormTarget({ mode: "create" })}
      />

      <OutsiderTeamMembersTable items={outsiderTeamMembers} />

      <TeamFormShell
        organizationId={organizationId}
        target={formTarget}
        onClose={() => setFormTarget(null)}
      />
    </div>
  );
}
