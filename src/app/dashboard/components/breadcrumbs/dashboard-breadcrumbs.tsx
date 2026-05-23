"use client";

import { Fragment } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  dashboardBreadcrumbSegmentLabels,
  getDashboardBreadcrumbDynamicLabel,
  getDashboardBreadcrumbLabelClassName,
  isDashboardBreadcrumbSegmentHidden,
} from "@/app/dashboard/lib/breadcrumbs/dashboard-breadcrumb-segments";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import { useIsMobile } from "@/hooks/use-mobile";
import { HomeIcon } from "lucide-react";

type ResolvedEntity = {
  id: string;
  type: "user" | "organization";
};

type BreadcrumbNode = {
  key: string;
  href: string;
  label: string;
  segment: string;
};

export function DashboardBreadcrumbs() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [resolvedLabels, setResolvedLabels] = useState<Record<string, string>>(
    {},
  );
  const pendingKeysRef = useRef<Set<string>>(new Set());

  const segmentsAfterDashboard = useMemo(() => {
    const fullSegments = pathname.split("/").filter(Boolean);
    const dashboardIndex = fullSegments.indexOf("dashboard");
    return dashboardIndex >= 0 ? fullSegments.slice(dashboardIndex + 1) : [];
  }, [pathname]);

  const entitiesToResolve = useMemo(() => {
    return segmentsAfterDashboard.reduce<ResolvedEntity[]>(
      (result, segment, index) => {
        const previousSegment = segmentsAfterDashboard[index - 1];

        if (previousSegment === "users") {
          result.push({
            id: segment,
            type: "user",
          });
        }

        if (previousSegment === "organizations") {
          result.push({
            id: segment,
            type: "organization",
          });
        }

        return result;
      },
      [],
    );
  }, [segmentsAfterDashboard]);

  useEffect(() => {
    const unresolvedEntities = entitiesToResolve.filter((entity) => {
      const key = `${entity.type}:${entity.id}`;
      return !resolvedLabels[key] && !pendingKeysRef.current.has(key);
    });

    if (!unresolvedEntities.length) {
      return;
    }

    for (const entity of unresolvedEntities) {
      pendingKeysRef.current.add(`${entity.type}:${entity.id}`);
    }

    let cancelled = false;

    async function resolveLabels() {
      const items = unresolvedEntities
        .map((entity) => `${entity.type}:${entity.id}`)
        .join(",");

      let labelsFromApi: Record<string, string | null> = {};

      try {
        const response = await fetch(
          `/api/dashboard/breadcrumb-labels?items=${encodeURIComponent(items)}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        if (response.ok) {
          const data = (await response.json()) as {
            labels?: Record<string, string | null>;
          };
          labelsFromApi = data.labels ?? {};
        }
      } catch {
        labelsFromApi = {};
      }

      if (cancelled) {
        return;
      }

      const nextLabels: Record<string, string> = {};
      for (const entity of unresolvedEntities) {
        const key = `${entity.type}:${entity.id}`;
        const label = labelsFromApi[key]?.trim();
        pendingKeysRef.current.delete(key);
        if (label) {
          nextLabels[key] = label;
        }
      }

      if (!Object.keys(nextLabels).length) {
        return;
      }

      setResolvedLabels((previous) => {
        let didChange = false;
        const merged = { ...previous };

        for (const [key, value] of Object.entries(nextLabels)) {
          if (merged[key] === value) {
            continue;
          }

          merged[key] = value;
          didChange = true;
        }

        return didChange ? merged : previous;
      });
    }

    void resolveLabels();

    return () => {
      cancelled = true;
    };
  }, [entitiesToResolve, resolvedLabels]);

  if (!segmentsAfterDashboard.length) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="inline-flex items-center gap-1">
              <HomeIcon className="size-3.5" />
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  let cumulativePath = dashboardRoutes.home();

  const allNodes = segmentsAfterDashboard.map(
    (segment, index): BreadcrumbNode => {
      cumulativePath = `${cumulativePath}/${segment}`;

      const previousSegment = segmentsAfterDashboard[index - 1];

      let translatedLabel =
        dashboardBreadcrumbSegmentLabels[segment] ||
        getDashboardBreadcrumbDynamicLabel(segment, previousSegment);

      if (previousSegment === "users") {
        translatedLabel = resolvedLabels[`user:${segment}`] ?? translatedLabel;
      }

      if (previousSegment === "organizations") {
        translatedLabel =
          resolvedLabels[`organization:${segment}`] ?? translatedLabel;
      }

      return {
        key: `${segment}-${index}`,
        href: cumulativePath,
        label: translatedLabel,
        segment,
      };
    },
  );

  const breadcrumbLabelClassName = getDashboardBreadcrumbLabelClassName();

  const displayNodes = allNodes.filter(
    (node) => !isDashboardBreadcrumbSegmentHidden(node.segment, { isMobile }),
  );

  const visibleNodes = isMobile ? displayNodes.slice(-2) : displayNodes;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            className="inline-flex items-center gap-1"
            render={<Link href={dashboardRoutes.home()} />}
          >
            <HomeIcon className="size-3.5" />
          </BreadcrumbLink>
        </BreadcrumbItem>

        {visibleNodes.map((node, index) => {
          const isLastItem = index === visibleNodes.length - 1;

          return (
            <Fragment key={node.key}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLastItem ? (
                  <BreadcrumbPage className={breadcrumbLabelClassName}>
                    {node.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    className={breadcrumbLabelClassName}
                    render={<Link href={node.href} />}
                  >
                    {node.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
