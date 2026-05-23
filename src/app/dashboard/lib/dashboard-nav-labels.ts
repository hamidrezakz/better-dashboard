/**
 * Cross-cutting dashboard navigation copy (sidebar, breadcrumbs, manage tabs).
 */
export const dashboardNavLabels = {
  navMainGroup: "Navigation",
  sidebar: {
    dashboard: "Dashboard",
    notifications: "Notifications",
    organizationManagement: "Organization management",
  },
  manageTabs: {
    members: "Members",
    teams: "Teams",
    invitations: "Invitations",
    notifications: "Notifications",
  },
  breadcrumbDynamicPrefix: {
    user: "User",
    organization: "Organization",
  },
  breadcrumbSegments: {
    dashboard: "Dashboard",
    users: "Users",
    organizations: "Organizations",
    manage: "Manage",
    members: "Members",
    teams: "Teams",
    invitations: "Invitations",
    notifications: "Notifications",
  },
} as const;
