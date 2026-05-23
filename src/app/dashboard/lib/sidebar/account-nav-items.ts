import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import {
  dashboardRouteSegments,
  dashboardRoutes,
} from "@/app/dashboard/lib/dashboard-routes";

export type AccountTabKey = "profile" | "security" | "sessions";

export const accountNavItems: ReadonlyArray<{
  key: AccountTabKey;
  label: string;
  pathSuffix: string;
  href: () => string;
}> = [
  {
    key: "profile",
    label: dashboardNavLabels.accountTabs.profile,
    pathSuffix: `/${dashboardRouteSegments.profile}`,
    href: dashboardRoutes.accountProfile,
  },
  {
    key: "security",
    label: dashboardNavLabels.accountTabs.security,
    pathSuffix: `/${dashboardRouteSegments.security}`,
    href: dashboardRoutes.accountSecurity,
  },
  {
    key: "sessions",
    label: dashboardNavLabels.accountTabs.sessions,
    pathSuffix: `/${dashboardRouteSegments.sessions}`,
    href: dashboardRoutes.accountSessions,
  },
] as const;

export function getActiveAccountTab(pathname: string): AccountTabKey {
  const match = [...accountNavItems]
    .reverse()
    .find((item) => pathname.includes(item.pathSuffix));

  return match?.key ?? "profile";
}
