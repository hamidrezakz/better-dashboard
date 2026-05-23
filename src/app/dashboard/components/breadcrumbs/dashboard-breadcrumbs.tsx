"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
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
  breadcrumbEntitiesInPath,
  breadcrumbEntityKey,
  serializeBreadcrumbEntityList,
} from "@/app/dashboard/lib/breadcrumbs/breadcrumb-entity";
import { dashboardBreadcrumbLabelClassName } from "@/app/dashboard/lib/breadcrumbs/dashboard-breadcrumb-segments";
import {
  buildDashboardBreadcrumbTrail,
  filterDashboardBreadcrumbTrail,
  getPathSegmentsAfterDashboard,
} from "@/app/dashboard/lib/breadcrumbs/dashboard-breadcrumb-trail";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import { useIsMobile } from "@/hooks/use-mobile";
import { HomeIcon } from "lucide-react";

export function DashboardBreadcrumbs() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [resolvedLabels, setResolvedLabels] = useState<Record<string, string>>(
    {},
  );
  const pendingKeysRef = useRef<Set<string>>(new Set());

  const segmentsAfterDashboard = useMemo(
    () => getPathSegmentsAfterDashboard(pathname),
    [pathname],
  );

  const entitiesToResolve = useMemo(
    () => breadcrumbEntitiesInPath(segmentsAfterDashboard),
    [segmentsAfterDashboard],
  );

  useEffect(() => {
    const unresolved = entitiesToResolve.filter((entity) => {
      const key = breadcrumbEntityKey(entity);
      return !resolvedLabels[key] && !pendingKeysRef.current.has(key);
    });

    if (!unresolved.length) {
      return;
    }

    for (const entity of unresolved) {
      pendingKeysRef.current.add(breadcrumbEntityKey(entity));
    }

    let cancelled = false;

    async function fetchLabels() {
      const items = serializeBreadcrumbEntityList(unresolved);
      let labelsFromApi: Record<string, string | null> = {};

      try {
        const response = await fetch(
          `/api/dashboard/breadcrumb-labels?items=${encodeURIComponent(items)}`,
          { method: "GET", cache: "no-store" },
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
      for (const entity of unresolved) {
        const key = breadcrumbEntityKey(entity);
        pendingKeysRef.current.delete(key);
        const label = labelsFromApi[key]?.trim();
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
          if (merged[key] !== value) {
            merged[key] = value;
            didChange = true;
          }
        }
        return didChange ? merged : previous;
      });
    }

    void fetchLabels();

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

  const homeHref = dashboardRoutes.home();
  const trail = buildDashboardBreadcrumbTrail({
    segments: segmentsAfterDashboard,
    homeHref,
    resolvedEntityLabels: resolvedLabels,
  });
  const visibleNodes = filterDashboardBreadcrumbTrail(trail, { isMobile });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            className="inline-flex items-center gap-1"
            render={<Link href={homeHref} />}
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
                  <BreadcrumbPage className={dashboardBreadcrumbLabelClassName}>
                    {node.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    className={dashboardBreadcrumbLabelClassName}
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
