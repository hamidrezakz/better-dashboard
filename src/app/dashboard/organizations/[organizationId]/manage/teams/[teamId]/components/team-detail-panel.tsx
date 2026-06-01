"use client";

import {
  CalendarIcon,
  PercentIcon,
  UsersIcon,
  UsersRoundIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteOrganizationTeamAction } from "@/app/action/dashboard/organizations/manage/teams/delete-organization-team-action";
import { StatCard, StatGrid } from "@/components/stat-card";
import {
  TeamFormShell,
  type TeamFormShellTarget,
} from "@/app/dashboard/organizations/[organizationId]/manage/teams/components/team-form-shell";
import { AddTeamMembersFormShell } from "@/app/dashboard/organizations/[organizationId]/manage/teams/[teamId]/members/components/add-team-members-form-shell";
import { TeamMembersTable } from "@/app/dashboard/organizations/[organizationId]/manage/teams/[teamId]/members/components/team-members-table";
import { TeamManageHeader } from "@/app/dashboard/organizations/[organizationId]/manage/teams/[teamId]/components/team-manage-header";
import { formatDate } from "@/lib/format-date";
import type { OrganizationTeamDetailPageResult } from "@/app/dashboard/organizations/[organizationId]/manage/teams/lib/get-organization-team-detail-page";
import type { OrganizationTeamItem } from "@/app/dashboard/organizations/[organizationId]/manage/teams/lib/team-form-utils";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import { toast } from "sonner";
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

function TeamDetailStatsGrid({
  memberCount,
  organizationMemberCount,
  createdAt,
  updatedAt,
}: {
  memberCount: number;
  organizationMemberCount: number;
  createdAt: string;
  updatedAt: string;
}) {
  const coveragePercent =
    organizationMemberCount > 0
      ? Math.round((memberCount / organizationMemberCount) * 100)
      : 0;

  return (
    <StatGrid columns={4}>
      <StatCard label="اعضای تیم" value={memberCount} icon={UsersRoundIcon} />
      <StatCard
        label="اعضای سازمان"
        value={organizationMemberCount}
        icon={UsersIcon}
      />
      <StatCard
        label="پوشش سازمان"
        value={`${coveragePercent}%`}
        icon={PercentIcon}
      />
      <StatCard
        label="ایجاد"
        value={formatDate(createdAt)}
        icon={CalendarIcon}
        hint={`به‌روزرسانی ${formatDate(updatedAt)}`}
      />
    </StatGrid>
  );
}

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
        toast.error(result.error ?? "حذف تیم ممکن نشد.");
        setDeleteConfirmOpen(false);
        return;
      }

      toast.success("تیم حذف شد.");
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

      <TeamDetailStatsGrid
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
            <AlertDialogTitle>حذف تیم</AlertDialogTitle>
            <AlertDialogDescription>
              «{data.team.name}» برای همیشه حذف خواهد شد. تیم باید بدون عضو
              باشد. این کار قابل بازگشت نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>انصراف</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isPending}
              onClick={handleDelete}
            >
              حذف تیم
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
