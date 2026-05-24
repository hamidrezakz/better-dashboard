"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteOrganizationTeamAction } from "@/app/action/dashboard/organizations/manage/teams/delete-organization-team-action";
import {
  TeamFormShell,
  type TeamFormShellTarget,
} from "@/app/dashboard/organizations/[organizationId]/manage/teams/components/team-form-shell";
import { TeamManageHeader } from "@/app/dashboard/organizations/[organizationId]/manage/teams/[teamId]/components/team-manage-header";
import type { OrganizationTeamPageResult } from "@/app/dashboard/organizations/[organizationId]/manage/teams/lib/get-organization-team-page";
import type { OrganizationTeamItem } from "@/app/dashboard/organizations/[organizationId]/manage/teams/lib/team-form-utils";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import { formatDate } from "@/lib/format-date";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type TeamDetailPanelProps = {
  organizationId: string;
  team: OrganizationTeamPageResult;
};

function teamToItem(team: OrganizationTeamPageResult): OrganizationTeamItem {
  return {
    id: team.id,
    name: team.name,
    memberCount: team.memberCount,
    createdAt: team.createdAt,
  };
}

export function TeamDetailPanel({
  organizationId,
  team,
}: TeamDetailPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    kind: "success" | "error";
    message: string;
  } | null>(null);
  const [formTarget, setFormTarget] = useState<TeamFormShellTarget | null>(
    null,
  );

  const handleDelete = () => {
    if (
      !window.confirm(
        `Delete "${team.name}"? This cannot be undone. The team must have no members.`,
      )
    ) {
      return;
    }

    startTransition(async () => {
      const result = await deleteOrganizationTeamAction({
        organizationId,
        teamId: team.id,
      });

      if (!result.success) {
        setFeedback({
          kind: "error",
          message: result.error ?? "Could not delete the team.",
        });
        return;
      }

      router.push(dashboardRoutes.organizationTeams(organizationId));
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <TeamManageHeader
        organizationId={organizationId}
        teamName={team.name}
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() =>
                setFormTarget({ mode: "edit", team: teamToItem(team) })
              }
            >
              {dashboardNavLabels.teamManage.editTeam}
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isPending}
              onClick={handleDelete}
            >
              {dashboardNavLabels.teamManage.deleteTeam}
            </Button>
          </>
        }
      />

      {feedback ? (
        <p
          className={
            feedback.kind === "error"
              ? "text-sm text-destructive"
              : "text-sm text-muted-foreground"
          }
        >
          {feedback.message}
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Team details and membership.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Members</dt>
              <dd className="font-medium">{team.memberCount}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Created</dt>
              <dd className="font-medium">{formatDate(team.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Last updated</dt>
              <dd className="font-medium">{formatDate(team.updatedAt)}</dd>
            </div>
          </dl>

          <Button
            nativeButton={false}
            render={
              <Link
                href={dashboardRoutes.organizationTeamMembers(
                  organizationId,
                  team.id,
                )}
              />
            }
          >
            {dashboardNavLabels.teamManage.manageMembers}
          </Button>
        </CardContent>
      </Card>

      <TeamFormShell
        organizationId={organizationId}
        target={formTarget}
        onClose={() => setFormTarget(null)}
        onFeedback={setFeedback}
      />
    </div>
  );
}
