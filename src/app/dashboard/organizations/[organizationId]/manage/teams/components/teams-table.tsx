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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team name</TableHead>
              <TableHead>Members</TableHead>
              <TableHead className="hidden sm:table-cell">Created</TableHead>
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
                  <TableCell className="font-medium">
                    <span className="block max-w-48 truncate" title={team.name}>
                      {team.name}
                    </span>
                  </TableCell>
                  <TableCell>{team.memberCount}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {formatDate(team.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
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
