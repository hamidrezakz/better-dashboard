import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import {
  dashboardRoutes,
  organizationManageTabPathSuffix,
} from "@/app/dashboard/lib/dashboard-routes";

export type OrganizationManageTabKey =
  | "members"
  | "teams"
  | "invitations"
  | "notifications";

export const organizationManageNavItems: ReadonlyArray<{
  key: OrganizationManageTabKey;
  label: string;
  pathSuffix: string;
  href: (organizationId: string) => string;
}> = [
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

export function getActiveOrganizationManageTab(
  pathname: string,
): OrganizationManageTabKey {
  const match = [...organizationManageNavItems]
    .reverse()
    .find(
      (item) => item.key !== "members" && pathname.includes(item.pathSuffix),
    );

  return match?.key ?? "members";
}
