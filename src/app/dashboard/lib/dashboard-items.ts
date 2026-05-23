import type {
  DashboardSidebarConfig,
  SidebarNavigationItem,
} from "@/app/dashboard/lib/sidebar-types";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import type { MembershipRole } from "@/generated/prisma/enums";
import { isOrganizationManagerRole } from "@/app/dashboard/lib/dashboard-access";

type DashboardMembershipState =
  | "no-active-organization"
  | "organization-member"
  | "organization-manager";

type DashboardNavigationContext = {
  userId: string;
  activeOrganizationId: string | null;
  activeOrganizationRole: MembershipRole | null;
};

export function getActiveOrganizationLandingPath(input: {
  organizationId: string | null;
  role: MembershipRole | null;
  userId?: string;
}) {
  if (!input.organizationId) {
    return input.userId
      ? dashboardRoutes.userProfile(input.userId)
      : dashboardRoutes.organizations();
  }

  return dashboardRoutes.organizationRoot(input.organizationId);
}

function resolveMembershipState(
  role: MembershipRole | null,
): DashboardMembershipState {
  if (!role) {
    return "no-active-organization";
  }

  if (isOrganizationManagerRole(role)) {
    return "organization-manager";
  }

  return "organization-member";
}

function getNotificationsItem(userId: string): SidebarNavigationItem {
  return {
    title: dashboardNavLabels.sidebar.notifications,
    url: dashboardRoutes.userNotifications(userId),
    icon: "bell",
  };
}

function getPersonalDashboardItem(userId: string): SidebarNavigationItem {
  return {
    title: dashboardNavLabels.sidebar.dashboard,
    url: dashboardRoutes.userProfile(userId),
    icon: "layout-dashboard",
  };
}

function getOrganizationDashboardItem(
  organizationId: string,
): SidebarNavigationItem {
  return {
    title: dashboardNavLabels.sidebar.dashboard,
    url: dashboardRoutes.organizationRoot(organizationId),
    icon: "layout-dashboard",
  };
}

function getOrganizationManagementItem(
  organizationId: string,
): SidebarNavigationItem {
  return {
    title: dashboardNavLabels.sidebar.organizationManagement,
    url: dashboardRoutes.organizationRoot(organizationId),
    icon: "settings",
  };
}

function getNoActiveOrganizationItems(
  context: DashboardNavigationContext,
): SidebarNavigationItem[] {
  return [
    getPersonalDashboardItem(context.userId),
    getNotificationsItem(context.userId),
  ];
}

function getMemberItems(
  context: DashboardNavigationContext,
): SidebarNavigationItem[] {
  if (!context.activeOrganizationId) {
    return getNoActiveOrganizationItems(context);
  }

  return [
    getOrganizationDashboardItem(context.activeOrganizationId),
    getNotificationsItem(context.userId),
  ];
}

function getManagerItems(
  context: DashboardNavigationContext,
): SidebarNavigationItem[] {
  if (!context.activeOrganizationId) {
    return getNoActiveOrganizationItems(context);
  }

  return [
    getOrganizationManagementItem(context.activeOrganizationId),
    getNotificationsItem(context.userId),
  ];
}

function getNavigationByState(
  state: DashboardMembershipState,
  context: DashboardNavigationContext,
) {
  switch (state) {
    case "organization-member":
      return getMemberItems(context);
    case "organization-manager":
      return getManagerItems(context);
    default:
      return getNoActiveOrganizationItems(context);
  }
}

export function getDashboardSidebarItems(
  context: DashboardNavigationContext,
): Pick<DashboardSidebarConfig, "navMain" | "projects"> {
  const membershipState = resolveMembershipState(
    context.activeOrganizationRole,
  );
  const navMain = getNavigationByState(membershipState, context);

  return {
    navMain,
    projects: [],
  };
}
