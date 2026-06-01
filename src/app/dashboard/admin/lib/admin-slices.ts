import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import {
  dashboardRouteSegments,
  dashboardRoutes,
} from "@/app/dashboard/lib/dashboard-routes";

/**
 * Platform admin tabs registered for navigation and trim docs.
 * To remove the admin slice: delete the admin route/action trees, then follow removing/admin.md at the repo root.
 */
export const adminSlices = [
  {
    key: "users",
    label: dashboardNavLabels.adminTabs.users,
    pathSuffix: `/${dashboardRouteSegments.users}`,
    href: dashboardRoutes.adminUsers,
  },
  {
    key: "organizations",
    label: dashboardNavLabels.adminTabs.organizations,
    pathSuffix: `/${dashboardRouteSegments.organizations}`,
    href: dashboardRoutes.adminOrganizations,
  },
] as const;

export type AdminSliceKey = (typeof adminSlices)[number]["key"];
