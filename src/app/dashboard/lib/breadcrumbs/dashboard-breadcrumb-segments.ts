import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";

export const dashboardBreadcrumbSegmentLabels: Record<string, string> = {
  ...dashboardNavLabels.breadcrumbSegments,
};

const breadcrumbLabelClassName =
  "max-w-[9rem] truncate sm:max-w-[12rem] md:max-w-[14rem]";

export function getDashboardBreadcrumbLabelClassName() {
  return breadcrumbLabelClassName;
}

export const dashboardBreadcrumbHiddenSegments = new Set([
  "users",
  "organizations",
]);

/** Dropped on small screens so org manage trails read as org name + tab only. */
export const dashboardBreadcrumbMobileHiddenSegments = new Set(["manage"]);

export function isDashboardBreadcrumbSegmentHidden(
  segment: string,
  options: { isMobile: boolean },
) {
  if (dashboardBreadcrumbHiddenSegments.has(segment)) {
    return true;
  }

  return (
    options.isMobile && dashboardBreadcrumbMobileHiddenSegments.has(segment)
  );
}

function decodePathSegment(segment: string) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

/** Placeholder until `/api/dashboard/breadcrumb-labels` resolves entity names. */
export function getDashboardBreadcrumbDynamicLabel(
  segment: string,
  previousSegment: string | undefined,
) {
  if (previousSegment === "users" || previousSegment === "organizations") {
    return decodePathSegment(segment);
  }

  return segment;
}
