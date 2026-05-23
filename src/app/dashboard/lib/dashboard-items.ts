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
}) {
  if (!input.organizationId) {
    return dashboardRoutes.home();
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

function getNotificationsItem(): SidebarNavigationItem {
  return {
    title: dashboardNavLabels.sidebar.notifications,
    url: dashboardRoutes.userNotifications(),
    icon: "bell",
  };
}

function getPersonalDashboardItem(): SidebarNavigationItem {
  return {
    title: dashboardNavLabels.sidebar.dashboard,
    url: dashboardRoutes.home(),
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
    url: dashboardRoutes.organizationMembers(organizationId),
    icon: "settings",
  };
}

function getPersonalScopeItems(): SidebarNavigationItem[] {
  return [getPersonalDashboardItem(), getNotificationsItem()];
}

function getNavigationByState(
  state: DashboardMembershipState,
  context: DashboardNavigationContext,
): SidebarNavigationItem[] {
  const organizationId = context.activeOrganizationId;

  if (!organizationId) {
    return getPersonalScopeItems();
  }

  switch (state) {
    case "organization-manager":
      return [
        getOrganizationManagementItem(organizationId),
        getNotificationsItem(),
      ];
    case "organization-member":
      return [
        getOrganizationDashboardItem(organizationId),
        getNotificationsItem(),
      ];
    default:
      return getPersonalScopeItems();
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
