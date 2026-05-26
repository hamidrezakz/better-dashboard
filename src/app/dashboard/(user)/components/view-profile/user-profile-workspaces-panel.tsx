import { Fragment } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  Building2Icon,
  ChevronRightIcon,
  UsersIcon,
} from "lucide-react";
import { RoleBadge } from "@/components/badge/role-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ItemSeparator } from "@/components/ui/item";
import { DashboardViewSection } from "@/app/dashboard/(user)/components/view-profile/dashboard-view-section";
import type { UserProfilePageData } from "@/app/dashboard/(user)/lib/get-user-profile-page";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import type { MembershipRole } from "@/generated/prisma/enums";
import { getUserInitials } from "@/lib/user-profile/user-display";
import { cn } from "@/lib/utils";

type UserProfileWorkspacesPanelProps = {
  data: UserProfilePageData;
};

type TeamMembership = UserProfilePageData["teamMemberships"][number];

type WorkspaceEntry = {
  organizationId: string;
  organizationName: string;
  membershipRole: MembershipRole | null;
  teams: TeamMembership[];
};

function groupTeamsByOrganization(teamMemberships: TeamMembership[]) {
  const teamsByOrganizationId = new Map<string, TeamMembership[]>();

  for (const membership of teamMemberships) {
    const teams = teamsByOrganizationId.get(membership.organizationId) ?? [];
    teams.push(membership);
    teamsByOrganizationId.set(membership.organizationId, teams);
  }

  return teamsByOrganizationId;
}

function buildWorkspaceEntries(data: UserProfilePageData): WorkspaceEntry[] {
  const teamsByOrganizationId = groupTeamsByOrganization(data.teamMemberships);
  const memberOrganizationIds = new Set(
    data.memberships.map((membership) => membership.organization.id),
  );

  const entries: WorkspaceEntry[] = data.memberships.map((membership) => ({
    organizationId: membership.organization.id,
    organizationName: membership.organization.name,
    membershipRole: membership.role,
    teams: teamsByOrganizationId.get(membership.organization.id) ?? [],
  }));

  const teamOnlyOrganizationIds = [
    ...new Set(
      data.teamMemberships
        .map((membership) => membership.organizationId)
        .filter((organizationId) => !memberOrganizationIds.has(organizationId)),
    ),
  ].sort((leftId, rightId) => {
    const leftName =
      data.teamMemberships.find(
        (membership) => membership.organizationId === leftId,
      )?.organizationName ?? "";
    const rightName =
      data.teamMemberships.find(
        (membership) => membership.organizationId === rightId,
      )?.organizationName ?? "";

    return leftName.localeCompare(rightName);
  });

  for (const organizationId of teamOnlyOrganizationIds) {
    const teams = teamsByOrganizationId.get(organizationId) ?? [];
    const organizationName = teams[0]?.organizationName ?? "";

    entries.push({
      organizationId,
      organizationName,
      membershipRole: null,
      teams,
    });
  }

  return entries;
}

function WorkspaceOrganizationHeader({
  entry,
  labels,
}: {
  entry: WorkspaceEntry;
  labels: (typeof dashboardNavLabels)["viewProfile"];
}) {
  const isOrganizationMember = entry.membershipRole != null;
  const titleBlock = (
    <>
      <Avatar className="size-10 shrink-0">
        <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
          {getUserInitials(entry.organizationName)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <CardTitle className="truncate text-base leading-tight">
          {entry.organizationName}
        </CardTitle>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {isOrganizationMember && entry.membershipRole ? (
          <RoleBadge role={entry.membershipRole} />
        ) : (
          <Badge variant="secondary">{labels.teamAccessOnly}</Badge>
        )}
        {isOrganizationMember ? (
          <ChevronRightIcon
            className="size-4 text-muted-foreground transition-transform group-hover/org:translate-x-0.5 group-hover/org:text-foreground"
            aria-hidden
          />
        ) : null}
      </div>
    </>
  );

  if (isOrganizationMember) {
    return (
      <Link
        href={dashboardRoutes.organizationRoot(entry.organizationId)}
        className="group/org -mx-1 flex items-center gap-3 rounded-md p-1 no-underline transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`${labels.openOrganization}: ${entry.organizationName}`}
      >
        {titleBlock}
      </Link>
    );
  }

  return <div className="flex items-center gap-3">{titleBlock}</div>;
}

export function UserProfileWorkspacesPanel({
  data,
}: UserProfileWorkspacesPanelProps) {
  const labels = dashboardNavLabels.viewProfile;
  const workspaceEntries = buildWorkspaceEntries(data);

  return (
    <DashboardViewSection title={labels.workspaces}>
      {workspaceEntries.length ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {workspaceEntries.map((entry) => (
            <li key={entry.organizationId}>
              <Card size="sm" className="h-full">
                <CardHeader className="border-b border-border/60 [.border-b]:pb-3">
                  <WorkspaceOrganizationHeader entry={entry} labels={labels} />
                </CardHeader>

                {entry.teams.length > 0 ? (
                  <CardContent>
                    <ul className="flex flex-col gap-0">
                      {entry.teams.map((team, index) => (
                        <Fragment key={`${team.organizationId}:${team.teamId}`}>
                          {index > 0 ? (
                            <ItemSeparator className="bg-border/50" />
                          ) : null}
                          <li>
                            <Link
                              href={dashboardRoutes.organizationTeamProfile(
                                team.organizationId,
                                team.teamId,
                              )}
                              className={cn(
                                "-mx-1 flex items-center gap-2.5 rounded-md p-1 text-sm no-underline transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                              )}
                              aria-label={`${labels.openTeam}: ${team.teamName}`}
                            >
                              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground">
                                <UsersIcon className="size-3.5" aria-hidden />
                              </span>
                              <span className="min-w-0 flex-1 truncate font-medium">
                                {team.teamName}
                              </span>
                              <ArrowRightIcon
                                className="size-3.5 shrink-0 text-muted-foreground"
                                aria-hidden
                              />
                            </Link>
                          </li>
                        </Fragment>
                      ))}
                    </ul>
                  </CardContent>
                ) : null}
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <Empty className="rounded-lg border border-dashed bg-muted/30">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Building2Icon />
            </EmptyMedia>
            <EmptyTitle>{labels.noOrganizations}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      )}
    </DashboardViewSection>
  );
}
