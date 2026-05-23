import {
  breadcrumbEntityKey,
  breadcrumbEntityTypeForParentSegment,
} from "@/app/dashboard/lib/breadcrumbs/breadcrumb-entity";
import {
  dashboardBreadcrumbSegmentLabels,
  getDashboardBreadcrumbDynamicLabel,
  isDashboardBreadcrumbSegmentHidden,
} from "@/app/dashboard/lib/breadcrumbs/dashboard-breadcrumb-segments";

export type DashboardBreadcrumbNode = {
  key: string;
  href: string;
  label: string;
  segment: string;
};

export function getPathSegmentsAfterDashboard(pathname: string): string[] {
  const segments = pathname.split("/").filter(Boolean);
  const dashboardIndex = segments.indexOf("dashboard");
  return dashboardIndex >= 0 ? segments.slice(dashboardIndex + 1) : [];
}

export function buildDashboardBreadcrumbTrail(input: {
  segments: string[];
  homeHref: string;
  resolvedEntityLabels: Record<string, string>;
}): DashboardBreadcrumbNode[] {
  let href = input.homeHref;

  return input.segments.map((segment, index) => {
    href = `${href}/${segment}`;
    const parentSegment = input.segments[index - 1];

    let label =
      dashboardBreadcrumbSegmentLabels[segment] ??
      getDashboardBreadcrumbDynamicLabel(segment, parentSegment);

    const entityType = breadcrumbEntityTypeForParentSegment(parentSegment);
    if (entityType) {
      const resolved =
        input.resolvedEntityLabels[
          breadcrumbEntityKey({ type: entityType, id: segment })
        ];
      if (resolved) {
        label = resolved;
      }
    }

    return {
      key: `${segment}-${index}`,
      href,
      label,
      segment,
    };
  });
}

export function filterDashboardBreadcrumbTrail(
  nodes: DashboardBreadcrumbNode[],
  options: { isMobile: boolean },
): DashboardBreadcrumbNode[] {
  const visible = nodes.filter(
    (node) => !isDashboardBreadcrumbSegmentHidden(node.segment, options),
  );
  return options.isMobile ? visible.slice(-2) : visible;
}
