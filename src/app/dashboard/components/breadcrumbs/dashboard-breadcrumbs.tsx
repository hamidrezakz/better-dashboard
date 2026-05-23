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
  entitiesInSegments,
  entityKey,
  formatEntitiesQuery,
} from "@/app/dashboard/lib/breadcrumbs/breadcrumb-entity";
import { labelClassName } from "@/app/dashboard/lib/breadcrumbs/dashboard-breadcrumb-segments";
import {
  buildTrail,
  segmentsAfterDashboard,
  visibleTrail,
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

  const segments = useMemo(() => segmentsAfterDashboard(pathname), [pathname]);

  const entitiesToResolve = useMemo(
    () => entitiesInSegments(segments),
    [segments],
  );

  useEffect(() => {
    const unresolved = entitiesToResolve.filter((entity) => {
      const key = entityKey(entity);
      return !resolvedLabels[key] && !pendingKeysRef.current.has(key);
    });

    if (!unresolved.length) {
      return;
    }

    for (const entity of unresolved) {
      pendingKeysRef.current.add(entityKey(entity));
    }

    let cancelled = false;

    async function fetchLabels() {
      const items = formatEntitiesQuery(unresolved);
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
        const key = entityKey(entity);
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

  if (!segments.length) {
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
  const trail = buildTrail({
    segments,
    homeHref,
    resolvedLabels,
  });
  const nodes = visibleTrail(trail, { isMobile });

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

        {nodes.map((node, index) => {
          const isLast = index === nodes.length - 1;

          return (
            <Fragment key={node.key}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className={labelClassName}>
                    {node.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    className={labelClassName}
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
