"use client";

import type { ReactNode } from "react";
import { DashboardTableFooter } from "@/components/dashboard-table/dashboard-table-footer";
import {
  formatDashboardTableNumber,
  getDashboardTableItemRange,
} from "@/lib/dashboard-table-pagination";
import { cn } from "@/lib/utils";

export type DashboardTableShellProps = {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  /** Noun after the total, e.g. `item`, `invitation`, `notification` */
  countLabel?: string;
  children: ReactNode;
  className?: string;
};

export function DashboardTableShell({
  page,
  pageSize,
  totalCount,
  onPageChange,
  countLabel = "item",
  children,
  className,
}: DashboardTableShellProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(page, totalPages);
  const { start, end } = getDashboardTableItemRange(
    safePage,
    pageSize,
    totalCount,
  );

  const range =
    totalCount > 0 ? (
      <span>
        {formatDashboardTableNumber(start)}–{formatDashboardTableNumber(end)}
      </span>
    ) : undefined;

  const total =
    totalCount > 0 ? (
      <span>
        {formatDashboardTableNumber(totalCount)} {countLabel}
      </span>
    ) : undefined;

  return (
    <div className={cn("space-y-6", className)}>
      {children}

      <DashboardTableFooter
        page={safePage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        range={range}
        total={total}
      />
    </div>
  );
}
