const DASHBOARD_BASE_PATH = "/dashboard";

/** Path segment literals — keep in sync with `src/app/dashboard/` route tree. */
export const dashboardRouteSegments = {
  organizations: "organizations",
  notifications: "notifications",
  account: "account",
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

export type AccountSettingsSection = "profile" | "security" | "sessions";

export const dashboardRoutes = {
  home: () => DASHBOARD_BASE_PATH,
  organizations: () =>
    `${DASHBOARD_BASE_PATH}/${dashboardRouteSegments.organizations}`,
  userNotifications: () =>
    `${DASHBOARD_BASE_PATH}/${dashboardRouteSegments.notifications}`,
  account: () => `${DASHBOARD_BASE_PATH}/${dashboardRouteSegments.account}`,
  /** Opens a panel on the account hub (dialog/sheet) — not a separate route. */
  accountSection: (section: AccountSettingsSection) =>
    `${DASHBOARD_BASE_PATH}/${dashboardRouteSegments.account}?section=${section}`,
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
