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
  accountPage: {
    title: "Account",
    description: "Profile, password, and where you are signed in.",
    profileTitle: "Public profile",
    profileDescription: "How your name and photo appear in the dashboard.",
    securityTitle: "Password",
    securityDescription: "Use a strong password you do not reuse elsewhere.",
    securityUnavailable:
      "This account does not sign in with email and password, so there is no password to change here.",
    sessionsTitle: "Active sessions",
    sessionsDescription:
      "Devices and browsers that can access your account. Revoke anything you do not recognize.",
    sessionsEmpty: "No active sessions were found.",
    sessionsOnlyThisDevice: "You are only signed in on this device.",
    sessionsCurrentDevice: "This device",
    sessionsRevoke: "Revoke",
    sessionsRevoking: "Revoking…",
    sessionsSignOutOthers: "Sign out other sessions",
    sessionsSigningOutOthers: "Signing out…",
    sessionsSignedIn: "Signed in",
    sessionsExpires: "Ends",
    sessionsIp: "IP",
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
