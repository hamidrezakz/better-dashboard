export const dashboardCacheTags = {
  sidebarConfigByUser: (userId: string) => `dashboard:sidebar:user:${userId}`,
  userProfileById: (userId: string) => `dashboard:user-profile:${userId}`,
  organizationSummaryById: (organizationId: string) =>
    `dashboard:organization-summary:${organizationId}`,
  organizationMembersById: (organizationId: string) =>
    `dashboard:organization-members:${organizationId}`,
  organizationTeamsById: (organizationId: string) =>
    `dashboard:organization-teams:${organizationId}`,
  organizationTeamProfileById: (organizationId: string, teamId: string) =>
    `dashboard:organization-team-profile:${organizationId}:${teamId}`,
  organizationInvitationsById: (organizationId: string) =>
    `dashboard:organization-invitations:${organizationId}`,
  organizationNotificationsById: (organizationId: string) =>
    `dashboard:organization-notifications:${organizationId}`,
  userNotificationsByUserId: (userId: string) =>
    `dashboard:user-notifications:${userId}`,
};
