import {
  entityKey,
  parentEntityType,
} from "@/app/dashboard/lib/breadcrumbs/breadcrumb-entity";
import {
  fallbackSegmentLabel,
  isSegmentHidden,
  segmentLabels,
} from "@/app/dashboard/lib/breadcrumbs/dashboard-breadcrumb-segments";

export type TrailNode = {
  key: string;
  href: string;
  label: string;
  segment: string;
};

export function segmentsAfterDashboard(pathname: string): string[] {
  const parts = pathname.split("/").filter(Boolean);
  const i = parts.indexOf("dashboard");
  return i >= 0 ? parts.slice(i + 1) : [];
}

export function buildTrail(input: {
  segments: string[];
  homeHref: string;
  resolvedLabels: Record<string, string>;
}): TrailNode[] {
  let href = input.homeHref;

  return input.segments.map((segment, index) => {
    href = `${href}/${segment}`;
    const parent = input.segments[index - 1];

    let label = segmentLabels[segment] ?? fallbackSegmentLabel(segment, parent);

    const type = parentEntityType(parent);
    if (type) {
      const resolved = input.resolvedLabels[entityKey({ type, id: segment })];
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

export function visibleTrail(
  nodes: TrailNode[],
  options: { isMobile: boolean },
): TrailNode[] {
  const visible = nodes.filter(
    (node) => !isSegmentHidden(node.segment, options),
  );
  return options.isMobile ? visible.slice(-2) : visible;
}
