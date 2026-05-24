"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteOrganizationTeamAction } from "@/app/action/dashboard/organizations/manage/teams/delete-organization-team-action";
import { TeamRowActionsMenu } from "@/app/dashboard/organizations/[organizationId]/manage/teams/components/team-row-actions-menu";
import type { OrganizationTeamItem } from "@/app/dashboard/organizations/[organizationId]/manage/teams/lib/team-form-utils";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TeamsTableProps = {
  organizationId: string;
  teams: OrganizationTeamItem[];
  feedback: { kind: "success" | "error"; message: string } | null;
  onCreate: () => void;
  onEdit: (team: OrganizationTeamItem) => void;
  onFeedback: (
    feedback: { kind: "success" | "error"; message: string } | null,
  ) => void;
};

export function TeamsTable({
  organizationId,
  teams,
  feedback,
  onCreate,
  onEdit,
  onFeedback,
}: TeamsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = (team: OrganizationTeamItem) => {
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
        onFeedback({
          kind: "error",
          message: result.error ?? "Could not delete the team.",
        });
        return;
      }

      onFeedback({
        kind: "success",
        message: "Team deleted.",
      });
      router.refresh();
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teams</CardTitle>
        <CardAction>
          <Button type="button" size="sm" onClick={onCreate}>
            <PlusIcon />
            {dashboardNavLabels.teamManage.addTeam}
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
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

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team name</TableHead>
              <TableHead>Members</TableHead>
              <TableHead className="hidden sm:table-cell">Created</TableHead>
              <TableHead className="w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.length ? (
              teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={dashboardRoutes.organizationTeam(
                        organizationId,
                        team.id,
                      )}
                      className="block max-w-48 truncate hover:underline"
                      title={team.name}
                    >
                      {team.name}
                    </Link>
                  </TableCell>
                  <TableCell>{team.memberCount}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {formatDate(team.createdAt)}
                  </TableCell>
                  <TableCell>
                    <TeamRowActionsMenu
                      team={team}
                      disabled={isPending}
                      onEdit={() => onEdit(team)}
                      onDelete={() => handleDelete(team)}
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
                  No teams yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
