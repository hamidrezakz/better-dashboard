const DASHBOARD_BASE_PATH = "/dashboard";

/** Path segment literals — keep in sync with `src/app/dashboard/` route tree. */
export const dashboardRouteSegments = {
  organizations: "organizations",
  notifications: "notifications",
  account: "account",
  profile: "profile",
  security: "security",
  sessions: "sessions",
  manage: "manage",
  members: "members",
  teams: "teams",
  invitations: "invitations",
} as const;

function encodeRouteSegment(value: string) {
  return encodeURIComponent(value);
}

function organizationPath(organizationId: string, ...rest: string[]) {
  const encodedId = encodeRouteSegment(organizationId);
  const tail = rest.length ? `/${rest.join("/")}` : "";
  return `${DASHBOARD_BASE_PATH}/${dashboardRouteSegments.organizations}/${encodedId}${tail}`;
}

export function organizationManageTabPathSuffix(
  tab: keyof Pick<
    typeof dashboardRouteSegments,
    "members" | "teams" | "invitations" | "notifications"
  >,
) {
  return `/${dashboardRouteSegments.manage}/${dashboardRouteSegments[tab]}`;
}

export const dashboardRoutes = {
  home: () => DASHBOARD_BASE_PATH,
  organizations: () =>
    `${DASHBOARD_BASE_PATH}/${dashboardRouteSegments.organizations}`,
  userNotifications: () =>
    `${DASHBOARD_BASE_PATH}/${dashboardRouteSegments.notifications}`,
  account: () => `${DASHBOARD_BASE_PATH}/${dashboardRouteSegments.account}`,
  accountProfile: () =>
    `${DASHBOARD_BASE_PATH}/${dashboardRouteSegments.account}/${dashboardRouteSegments.profile}`,
  accountSecurity: () =>
    `${DASHBOARD_BASE_PATH}/${dashboardRouteSegments.account}/${dashboardRouteSegments.security}`,
  accountSessions: () =>
    `${DASHBOARD_BASE_PATH}/${dashboardRouteSegments.account}/${dashboardRouteSegments.sessions}`,
  organizationRoot: (organizationId: string) =>
    organizationPath(organizationId),
  organizationManageRoot: (organizationId: string) =>
    organizationPath(organizationId, dashboardRouteSegments.manage),
  organizationMembers: (organizationId: string) =>
    organizationPath(
      organizationId,
      dashboardRouteSegments.manage,
      dashboardRouteSegments.members,
    ),
  organizationTeams: (organizationId: string) =>
    organizationPath(
      organizationId,
      dashboardRouteSegments.manage,
      dashboardRouteSegments.teams,
    ),
  organizationTeam: (organizationId: string, teamId: string) =>
    organizationPath(
      organizationId,
      dashboardRouteSegments.manage,
      dashboardRouteSegments.teams,
      encodeRouteSegment(teamId),
    ),
  organizationTeamMembers: (organizationId: string, teamId: string) =>
    organizationPath(
      organizationId,
      dashboardRouteSegments.manage,
      dashboardRouteSegments.teams,
      encodeRouteSegment(teamId),
      dashboardRouteSegments.members,
    ),
  organizationInvitations: (organizationId: string) =>
    organizationPath(
      organizationId,
      dashboardRouteSegments.manage,
      dashboardRouteSegments.invitations,
    ),
  organizationNotifications: (organizationId: string) =>
    organizationPath(
      organizationId,
      dashboardRouteSegments.manage,
      dashboardRouteSegments.notifications,
    ),
} as const;
