import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardTableCardFallback } from "@/app/dashboard/components/shell/dashboard-page-fallbacks";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import { formatDate } from "@/lib/format-date";
import { prisma } from "@/lib/prisma";

type OrganizationTeamsPageProps = {
  params: Promise<{
    organizationId: string;
  }>;
};

async function getOrganizationTeamsData(organizationId: string) {
  "use cache";

  cacheLife("minutes");
  cacheTag(dashboardCacheTags.organizationTeamsById(organizationId));

  const [teams, organizationMembers] = await Promise.all([
    prisma.team.findMany({
      where: {
        organizationId,
      },
      include: {
        _count: {
          select: {
            teammembers: true,
          },
        },
        teammembers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.member.findMany({
      where: {
        organizationId,
      },
      select: {
        userId: true,
      },
    }),
  ]);

  const organizationMemberIds = new Set(
    organizationMembers.map((member) => member.userId),
  );

  const outsiderTeamMembers = teams.flatMap((team) =>
    team.teammembers
      .filter((member) => !organizationMemberIds.has(member.userId))
      .map((member) => ({
        id: member.id,
        teamName: team.name,
        userName: member.user.name,
        userEmail: member.user.email,
      })),
  );

  return {
    teams: teams.map((team) => ({
      id: team.id,
      name: team.name,
      memberCount: team._count.teammembers,
      createdAt: team.createdAt.toISOString(),
    })),
    outsiderTeamMembers,
  };
}

export default function OrganizationTeamsPage(
  props: OrganizationTeamsPageProps,
) {
  return (
    <div className="space-y-4">
      <Suspense fallback={<DashboardTableCardFallback />}>
        <OrganizationTeamsTable {...props} />
      </Suspense>
      <Suspense fallback={<DashboardTableCardFallback />}>
        <OrganizationOutsiderMembersTable {...props} />
      </Suspense>
    </div>
  );
}

async function OrganizationTeamsTable({ params }: OrganizationTeamsPageProps) {
  const { organizationId } = await params;
  const data = await getOrganizationTeamsData(organizationId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teams</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team name</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.teams.length ? (
              data.teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">{team.name}</TableCell>
                  <TableCell>{team.memberCount}</TableCell>
                  <TableCell>{formatDate(team.createdAt)}</TableCell>
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

async function OrganizationOutsiderMembersTable({
  params,
}: OrganizationTeamsPageProps) {
  const { organizationId } = await params;
  const data = await getOrganizationTeamsData(organizationId);

  if (!data.outsiderTeamMembers.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team members without organization membership</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Team</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.outsiderTeamMembers.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.userName}</TableCell>
                <TableCell className="text-muted-foreground">
                  {item.userEmail}
                </TableCell>
                <TableCell>{item.teamName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
