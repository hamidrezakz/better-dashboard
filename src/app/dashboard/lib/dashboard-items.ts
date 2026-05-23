import type {
  DashboardSidebarConfig,
  SidebarNavigationGroup,
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

    icon: "home",
  };
}

function getOrganizationDashboardItem(
  organizationId: string,
): SidebarNavigationItem {
  return {
    title: dashboardNavLabels.sidebar.organizationHome,

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

function getOrganizationScopeItems(
  organizationId: string,

  state: DashboardMembershipState,
): SidebarNavigationItem[] {
  const items: SidebarNavigationItem[] = [
    getOrganizationDashboardItem(organizationId),
  ];

  if (state === "organization-manager") {
    items.push(getOrganizationManagementItem(organizationId));
  }

  return items;
}

function getNavigationGroupsByState(
  state: DashboardMembershipState,

  context: DashboardNavigationContext,
): SidebarNavigationGroup[] {
  const groups: SidebarNavigationGroup[] = [
    {
      id: "home",

      items: [getPersonalDashboardItem()],
    },
  ];

  groups.push({
    id: "personal",

    items: [getNotificationsItem()],
  });

  const organizationId = context.activeOrganizationId;

  if (organizationId && state !== "no-active-organization") {
    groups.push({
      id: "organization",

      items: getOrganizationScopeItems(organizationId, state),
    });
  }

  return groups;
}

export function getDashboardSidebarItems(
  context: DashboardNavigationContext,
): Pick<DashboardSidebarConfig, "navGroups" | "projects"> {
  const membershipState = resolveMembershipState(
    context.activeOrganizationRole,
  );

  const navGroups = getNavigationGroupsByState(membershipState, context);

  return {
    navGroups,

    projects: [],
  };
}
