/**
 * Cross-cutting dashboard navigation copy (sidebar, breadcrumbs, manage tabs).
 * Single language only — edit strings here when switching locale (e.g. to English).
 * Not an i18n layer: no runtime locale switching.
 */
export const dashboardNavLabels = {
  navMainGroup: "ناوبری",
  sidebar: {
    dashboard: "داشبورد",
    notifications: "اعلان‌ها",
    organizationManagement: "مدیریت سازمان",
  },
  manageTabs: {
    members: "اعضا",
    teams: "تیم‌ها",
    invitations: "دعوت‌نامه‌ها",
    notifications: "اعلان‌ها",
  },
  breadcrumbDynamicPrefix: {
    user: "کاربر",
    organization: "سازمان",
  },
  breadcrumbSegments: {
    dashboard: "داشبورد",
    users: "کاربران",
    organizations: "سازمان‌ها",
    manage: "مدیریت",
    members: "اعضا",
    teams: "تیم‌ها",
    invitations: "دعوت‌نامه‌ها",
    notifications: "اعلان‌ها",
  },
} as const;
