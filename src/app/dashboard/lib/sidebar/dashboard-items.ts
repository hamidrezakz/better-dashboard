import type {
  DashboardSidebarConfig,
  SidebarNavigationGroup,
  SidebarNavigationItem,
} from "@/app/dashboard/lib/sidebar/sidebar-types";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import type { MembershipRole } from "@/generated/prisma/enums";
import { isOrganizationManagerRole } from "@/app/dashboard/lib/dashboard-access";

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

function membershipState(
  role: MembershipRole | null,
): "none" | "member" | "manager" {
  if (!role) {
    return "none";
  }
  return isOrganizationManagerRole(role) ? "manager" : "member";
}

export function getDashboardSidebarItems(
  context: DashboardNavigationContext,
): Pick<DashboardSidebarConfig, "navGroups" | "projects"> {
  const state = membershipState(context.activeOrganizationRole);
  const organizationId = context.activeOrganizationId;

  const navGroups: SidebarNavigationGroup[] = [
    {
      id: "home",
      items: [
        {
          title: dashboardNavLabels.sidebar.dashboard,
          url: dashboardRoutes.home(),
          icon: "home",
        },
      ],
    },
  ];

  if (organizationId && state !== "none") {
    const organizationItems: SidebarNavigationItem[] = [
      {
        title: dashboardNavLabels.sidebar.organizationHome,
        url: dashboardRoutes.organizationRoot(organizationId),
        icon: "layout-dashboard",
      },
    ];

    if (state === "manager") {
      organizationItems.push({
        title: dashboardNavLabels.sidebar.organizationManagement,
        url: dashboardRoutes.organizationMembers(organizationId),
        icon: "settings",
      });
    }

    navGroups.push({
      id: "organization",
      items: organizationItems,
    });
  }

  return { navGroups, projects: [] };
}
