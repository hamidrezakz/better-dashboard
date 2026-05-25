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
  accountSettings: {
    profile: "Profile",
    security: "Password",
    sessions: "Active sessions",
    profileDescription: "Name and profile photo",
    securityDescription: "Change your sign-in password",
    sessionsDescription: "Devices where you are signed in",
    editProfile: "Edit profile",
  },
  manageTabs: {
    members: "Members",
    teams: "Teams",
    teamMembers: "Team members",
    invitations: "Invitations",
    notifications: "Notifications",
  },
  teamManage: {
    allTeams: "All teams",
    manageMembers: "Manage members",
    addTeam: "Add team",
    editTeam: "Edit team",
    deleteTeam: "Delete team",
    addMembers: "Add members",
  },
  memberManage: {
    changeRole: "Change role",
    manageTeams: "Manage teams",
    removeFromOrganization: "Remove from organization",
    removeFromTeam: "Remove from team",
  },
  invitationManage: {
    deleteTitle: "Delete invitation",
    deleteDescription:
      "This invitation link will stop working immediately. This cannot be undone.",
    deleteConfirm: "Delete invitation",
  },
  breadcrumbSegments: {
    dashboard: "Dashboard",
    users: "Users",
    organizations: "Organizations",
    account: "Account",
    manage: "Manage",
    members: "Members",
    teams: "Teams",
    team: "Team",
    invitations: "Invitations",
    notifications: "Notifications",
  },
} as const;
