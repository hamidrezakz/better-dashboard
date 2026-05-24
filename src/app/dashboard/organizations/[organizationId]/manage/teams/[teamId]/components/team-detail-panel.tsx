"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteOrganizationTeamAction } from "@/app/action/dashboard/organizations/manage/teams/delete-organization-team-action";
import {
  TeamFormShell,
  type TeamFormShellTarget,
} from "@/app/dashboard/organizations/[organizationId]/manage/teams/components/team-form-shell";
import { AddTeamMembersFormShell } from "@/app/dashboard/organizations/[organizationId]/manage/teams/[teamId]/members/components/add-team-members-form-shell";
import { TeamMembersTable } from "@/app/dashboard/organizations/[organizationId]/manage/teams/[teamId]/members/components/team-members-table";
import { TeamDetailStats } from "@/app/dashboard/organizations/[organizationId]/manage/teams/[teamId]/components/team-detail-stats";
import { TeamManageHeader } from "@/app/dashboard/organizations/[organizationId]/manage/teams/[teamId]/components/team-manage-header";
import type { OrganizationTeamDetailPageResult } from "@/app/dashboard/organizations/[organizationId]/manage/teams/lib/get-organization-team-detail-page";
import type { OrganizationTeamItem } from "@/app/dashboard/organizations/[organizationId]/manage/teams/lib/team-form-utils";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import { dashboardToast } from "@/app/dashboard/lib/dashboard-toast";
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
import { Button } from "@/components/ui/button";

type TeamDetailPanelProps = {
  organizationId: string;
  data: OrganizationTeamDetailPageResult;
};

function teamToItem(
  team: OrganizationTeamDetailPageResult["team"],
): OrganizationTeamItem {
  return {
    id: team.id,
    name: team.name,
    memberCount: team.memberCount,
    createdAt: team.createdAt,
  };
}

export function TeamDetailPanel({
  organizationId,
  data,
}: TeamDetailPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formTarget, setFormTarget] = useState<TeamFormShellTarget | null>(
    null,
  );
  const [addMembersOpen, setAddMembersOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const excludeUserIds = data.members.map((member) => member.userId);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteOrganizationTeamAction({
        organizationId,
        teamId: data.team.id,
      });

      if (!result.success) {
        dashboardToast.error(result.error ?? "Could not delete the team.");
        setDeleteConfirmOpen(false);
        return;
      }

      dashboardToast.success("Team deleted.");
      setDeleteConfirmOpen(false);
      router.push(dashboardRoutes.organizationTeams(organizationId));
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <TeamManageHeader
        organizationId={organizationId}
        teamName={data.team.name}
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() =>
                setFormTarget({ mode: "edit", team: teamToItem(data.team) })
              }
            >
              {dashboardNavLabels.teamManage.editTeam}
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isPending}
              onClick={() => setDeleteConfirmOpen(true)}
            >
              {dashboardNavLabels.teamManage.deleteTeam}
            </Button>
          </>
        }
      />

      <TeamDetailStats
        memberCount={data.team.memberCount}
        organizationMemberCount={data.organizationMemberCount}
        createdAt={data.team.createdAt}
        updatedAt={data.team.updatedAt}
      />

      <TeamMembersTable
        organizationId={organizationId}
        teamId={data.team.id}
        members={data.members}
        page={data.page}
        pageSize={data.pageSize}
        totalCount={data.totalCount}
        onAddMembers={() => setAddMembersOpen(true)}
      />

      <AddTeamMembersFormShell
        organizationId={organizationId}
        teamId={data.team.id}
        open={addMembersOpen}
        excludeUserIds={excludeUserIds}
        onClose={() => setAddMembersOpen(false)}
      />

      <TeamFormShell
        organizationId={organizationId}
        target={formTarget}
        onClose={() => setFormTarget(null)}
      />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete team</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{data.team.name}&rdquo; will be permanently deleted. The
              team must have no members. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isPending}
              onClick={handleDelete}
            >
              Delete team
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
