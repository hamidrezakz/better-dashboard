import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import {
  dashboardRoutes,
  organizationManageTabPathSuffix,
} from "@/app/dashboard/lib/dashboard-routes";

/**
 * Organization manage tabs registered for navigation and trim docs.
 * To remove a slice: delete its entry here, then follow removing/<feature>.md at the repo root.
 */
export const organizationManageSlices = [
  {
    key: "members",
    label: dashboardNavLabels.manageTabs.members,
    pathSuffix: organizationManageTabPathSuffix("members"),
    href: dashboardRoutes.organizationMembers,
  },
  {
    key: "teams",
    label: dashboardNavLabels.manageTabs.teams,
    pathSuffix: organizationManageTabPathSuffix("teams"),
    href: dashboardRoutes.organizationTeams,
  },
  {
    key: "invitations",
    label: dashboardNavLabels.manageTabs.invitations,
    pathSuffix: organizationManageTabPathSuffix("invitations"),
    href: dashboardRoutes.organizationInvitations,
  },
  {
    key: "notifications",
    label: dashboardNavLabels.manageTabs.notifications,
    pathSuffix: organizationManageTabPathSuffix("notifications"),
    href: dashboardRoutes.organizationNotifications,
  },
] as const;

export type OrganizationManageSliceKey =
  (typeof organizationManageSlices)[number]["key"];
