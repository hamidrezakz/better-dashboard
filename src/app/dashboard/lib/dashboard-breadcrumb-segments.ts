import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";

export const dashboardBreadcrumbSegmentLabels: Record<string, string> = {
  ...dashboardNavLabels.breadcrumbSegments,
};

export const dashboardBreadcrumbHiddenSegments = new Set([
  "users",
  "organizations",
]);

export function getDashboardBreadcrumbDynamicLabel(
  segment: string,
  previousSegment: string | undefined,
) {
  if (previousSegment === "users") {
    return `${dashboardNavLabels.breadcrumbDynamicPrefix.user} ${segment.slice(0, 6)}`;
  }

  if (previousSegment === "organizations") {
    return `${dashboardNavLabels.breadcrumbDynamicPrefix.organization} ${segment.slice(0, 6)}`;
  }

  return segment;
}
