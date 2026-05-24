import { parentEntityType } from "@/app/dashboard/lib/breadcrumbs/breadcrumb-entity";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";

export const segmentLabels: Record<string, string> = {
  ...dashboardNavLabels.breadcrumbSegments,
};

export const labelClassName =
  "max-w-[9rem] truncate sm:max-w-[10rem] md:max-w-[12rem]";

const HIDDEN_ALWAYS = new Set(["users", "organizations"]);
const HIDDEN_ON_MOBILE = new Set(["manage"]);

export function isSegmentHidden(
  segment: string,
  options: { isMobile: boolean },
) {
  if (HIDDEN_ALWAYS.has(segment)) {
    return true;
  }
  return options.isMobile && HIDDEN_ON_MOBILE.has(segment);
}

/**
 * URL path segments are often percent-encoded (`%20` = space). decodeURIComponent
 * turns that into normal text for the breadcrumb until the API returns the real name.
 */
function decodeSegmentForDisplay(segment: string) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

/** Placeholder for entity IDs until `/api/dashboard/breadcrumb-labels` responds. */
export function fallbackSegmentLabel(
  segment: string,
  parentSegment: string | undefined,
) {
  if (parentEntityType(parentSegment)) {
    return decodeSegmentForDisplay(segment);
  }
  return segment;
}
