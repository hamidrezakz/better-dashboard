const DASHBOARD_BASE_PATH = "/dashboard";

function encodeRouteSegment(value: string) {
  return encodeURIComponent(value);
}

export const dashboardRoutes = {
  home: () => DASHBOARD_BASE_PATH,
  organizations: () => `${DASHBOARD_BASE_PATH}/organizations`,
  userProfile: (userId: string) =>
    `${DASHBOARD_BASE_PATH}/users/${encodeRouteSegment(userId)}`,
  userNotifications: (userId: string) =>
    `${DASHBOARD_BASE_PATH}/users/${encodeRouteSegment(userId)}/notifications`,
  organizationRoot: (organizationId: string) =>
    `${DASHBOARD_BASE_PATH}/organizations/${encodeRouteSegment(organizationId)}`,
  organizationManageRoot: (organizationId: string) =>
    `${DASHBOARD_BASE_PATH}/organizations/${encodeRouteSegment(organizationId)}/manage`,
  organizationMembers: (organizationId: string) =>
    `${DASHBOARD_BASE_PATH}/organizations/${encodeRouteSegment(organizationId)}/manage/members`,
  organizationTeams: (organizationId: string) =>
    `${DASHBOARD_BASE_PATH}/organizations/${encodeRouteSegment(organizationId)}/manage/teams`,
  organizationInvitations: (organizationId: string) =>
    `${DASHBOARD_BASE_PATH}/organizations/${encodeRouteSegment(organizationId)}/manage/invitations`,
  organizationNotifications: (organizationId: string) =>
    `${DASHBOARD_BASE_PATH}/organizations/${encodeRouteSegment(organizationId)}/manage/notifications`,
} as const;
