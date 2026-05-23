/**
 * Cross-cutting dashboard navigation copy (sidebar, breadcrumbs, manage tabs).
 */
export const dashboardNavLabels = {
  sidebar: {
    dashboard: "Dashboard",
    account: "Account",
    organizationHome: "Overview",
    notifications: "Notifications",
    organizationManagement: "Organization management",
    groupOrganization: "Organization",
  },
  accountTabs: {
    profile: "Profile",
    security: "Security",
    sessions: "Sessions",
  },
  accountHome: {
    manageAccount: "Manage account",
  },
  manageTabs: {
    members: "Members",
    teams: "Teams",
    invitations: "Invitations",
    notifications: "Notifications",
  },
  breadcrumbSegments: {
    dashboard: "Dashboard",
    users: "Users",
    organizations: "Organizations",
    account: "Account",
    profile: "Profile",
    security: "Security",
    sessions: "Sessions",
    manage: "Manage",
    members: "Members",
    teams: "Teams",
    invitations: "Invitations",
    notifications: "Notifications",
  },
} as const;
