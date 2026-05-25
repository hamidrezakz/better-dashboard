"use client";

import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { DashboardTableViewport } from "@/components/dashboard-table/dashboard-table-viewport";
import { TeamRowActionsMenu } from "@/app/dashboard/organizations/[organizationId]/manage/teams/components/team-row-actions-menu";
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
  onCreate: () => void;
};

export function TeamsTable({
  organizationId,
  teams,
  onCreate,
}: TeamsTableProps) {
  const router = useRouter();

  const openTeam = (teamId: string) => {
    router.push(dashboardRoutes.organizationTeam(organizationId, teamId));
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

      <CardContent>
        <DashboardTableViewport>
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-0 whitespace-normal">
                  Team name
                </TableHead>
                <TableHead className="whitespace-normal">Members</TableHead>
                <TableHead className="hidden whitespace-normal sm:table-cell">
                  Created
                </TableHead>
                <TableHead className="w-12 whitespace-normal">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.length ? (
                teams.map((team) => (
                  <TableRow
                    key={team.id}
                    className="cursor-pointer"
                    onClick={() => openTeam(team.id)}
                  >
                    <TableCell className="min-w-0 whitespace-normal font-medium">
                      <span className="block truncate" title={team.name}>
                        {team.name}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      {team.memberCount}
                    </TableCell>
                    <TableCell className="hidden whitespace-normal sm:table-cell">
                      {formatDate(team.createdAt)}
                    </TableCell>
                    <TableCell
                      className="w-12 whitespace-normal"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <TeamRowActionsMenu
                        teamName={team.name}
                        onView={() => openTeam(team.id)}
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
        </DashboardTableViewport>
      </CardContent>
    </Card>
  );
}
