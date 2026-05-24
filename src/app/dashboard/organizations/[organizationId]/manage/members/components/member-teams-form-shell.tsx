"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setOrganizationMemberTeamsAction } from "@/app/action/dashboard/organizations/manage/members/set-organization-member-teams-action";
import { DashboardFormShell } from "@/app/dashboard/components/form-shell/dashboard-form-shell";
import { DashboardFormShellFooterActions } from "@/app/dashboard/components/form-shell/dashboard-form-shell-footer-actions";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import { dashboardToast } from "@/app/dashboard/lib/dashboard-toast";
import type { OrganizationMemberItem } from "@/app/dashboard/organizations/[organizationId]/manage/members/lib/get-organization-members-page";
import { FormLabel } from "@/components/form/form-label";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type MemberTeamsFormShellProps = {
  organizationId: string;
  member: OrganizationMemberItem | null;
  teams: Array<{ id: string; name: string }>;
  open: boolean;
  onClose: () => void;
};

export function MemberTeamsFormShell({
  organizationId,
  member,
  teams,
  open,
  onClose,
}: MemberTeamsFormShellProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);

  useEffect(() => {
    if (member) {
      setSelectedTeamIds(member.teams.map((team) => team.id));
    }
  }, [member]);

  const toggleTeam = (teamId: string, checked: boolean) => {
    setSelectedTeamIds((current) => {
      if (checked) {
        return current.includes(teamId) ? current : [...current, teamId];
      }

      return current.filter((id) => id !== teamId);
    });
  };

  const handleSubmit = () => {
    if (!member) {
      return;
    }

    startTransition(async () => {
      const result = await setOrganizationMemberTeamsAction({
        organizationId,
        memberId: member.id,
        teamIds: selectedTeamIds,
      });

      if (!result.success) {
        dashboardToast.error(
          result.error ?? "Could not update team memberships.",
        );
        return;
      }

      dashboardToast.success("Team memberships updated.");
      onClose();
      router.refresh();
    });
  };

  return (
    <DashboardFormShell
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
      title={dashboardNavLabels.memberManage.manageTeams}
      description={
        member
          ? `Choose which teams ${member.name} belongs to.`
          : "Manage team memberships."
      }
      footer={
        <DashboardFormShellFooterActions
          cancel={{
            label: "Cancel",
            onClick: onClose,
            disabled: isPending,
          }}
          primary={{
            label: "Save teams",
            onClick: handleSubmit,
            disabled: isPending || !member,
          }}
        />
      }
    >
      {member ? (
        <div className="space-y-3">
          <FormLabel>Teams</FormLabel>
          {teams.length ? (
            <ul className="space-y-2">
              {teams.map((team) => {
                const checked = selectedTeamIds.includes(team.id);
                const checkboxId = `member-team-${member.id}-${team.id}`;

                return (
                  <li key={team.id} className="flex items-center gap-2">
                    <Checkbox
                      id={checkboxId}
                      checked={checked}
                      disabled={isPending}
                      onCheckedChange={(next) =>
                        toggleTeam(team.id, next === true)
                      }
                    />
                    <Label htmlFor={checkboxId} className="font-normal">
                      <span
                        className="block max-w-sm truncate"
                        title={team.name}
                      >
                        {team.name}
                      </span>
                    </Label>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No teams in this organization yet.
            </p>
          )}
        </div>
      ) : null}
    </DashboardFormShell>
  );
}
