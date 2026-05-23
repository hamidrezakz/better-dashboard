/**
 * Cross-cutting dashboard navigation copy (sidebar, breadcrumbs, manage tabs).
 */
export const dashboardNavLabels = {
  sidebar: {
    dashboard: "Dashboard",
    organizationHome: "Overview",
    notifications: "Notifications",
    organizationManagement: "Organization management",
    groupOrganization: "Organization",
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
    manage: "Manage",
    members: "Members",
    teams: "Teams",
    invitations: "Invitations",
    notifications: "Notifications",
  },
} as const;
