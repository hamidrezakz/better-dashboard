import { breadcrumbEntityTypeForParentSegment } from "@/app/dashboard/lib/breadcrumbs/breadcrumb-entity";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";

export const dashboardBreadcrumbSegmentLabels: Record<string, string> = {
  ...dashboardNavLabels.breadcrumbSegments,
};

export const dashboardBreadcrumbLabelClassName =
  "max-w-[9rem] truncate sm:max-w-[10rem] md:max-w-[12rem]";

/** Always omitted from the trail (`…/users/:id` → show user name only). */
const BREADCRUMB_SEGMENTS_ALWAYS_HIDDEN = new Set(["users", "organizations"]);

/** Omitted on small screens so org manage reads as org name + tab. */
const BREADCRUMB_SEGMENTS_HIDDEN_ON_MOBILE = new Set(["manage"]);

export function isDashboardBreadcrumbSegmentHidden(
  segment: string,
  options: { isMobile: boolean },
) {
  if (BREADCRUMB_SEGMENTS_ALWAYS_HIDDEN.has(segment)) {
    return true;
  }
  return options.isMobile && BREADCRUMB_SEGMENTS_HIDDEN_ON_MOBILE.has(segment);
}

function decodePathSegment(segment: string) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

/** Fallback label for dynamic IDs until `/api/dashboard/breadcrumb-labels` resolves. */
export function getDashboardBreadcrumbDynamicLabel(
  segment: string,
  previousSegment: string | undefined,
) {
  if (breadcrumbEntityTypeForParentSegment(previousSegment)) {
    return decodePathSegment(segment);
  }
  return segment;
}
