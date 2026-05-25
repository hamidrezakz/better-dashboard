"use client";

import type { ReactNode } from "react";
import { DashboardTableFooter } from "@/components/dashboard-table/dashboard-table-footer";
import { DashboardTablePageSizeSelect } from "@/components/dashboard-table/dashboard-table-page-size-select";
import { DASHBOARD_TABLE_PAGE_SIZES } from "@/lib/dashboard-table-page-size";
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
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: readonly number[];
  /** Noun for screen readers, e.g. `notification` */
  countLabel?: string;
  children: ReactNode;
  className?: string;
};

export function DashboardTableShell({
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DASHBOARD_TABLE_PAGE_SIZES,
  countLabel = "item",
  children,
  className,
}: DashboardTableShellProps) {
  if (totalCount <= 0) {
    return <div className={cn("space-y-6", className)}>{children}</div>;
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(page, totalPages);
  const { start, end } = getDashboardTableItemRange(
    safePage,
    pageSize,
    totalCount,
  );

  const summary = (
    <span
      aria-label={`${formatDashboardTableNumber(start)} to ${formatDashboardTableNumber(end)} of ${formatDashboardTableNumber(totalCount)} ${countLabel}${totalCount === 1 ? "" : "s"}`}
    >
      {formatDashboardTableNumber(start)}–{formatDashboardTableNumber(end)} of{" "}
      {formatDashboardTableNumber(totalCount)}
    </span>
  );

  const pageSizeControl = (
    <DashboardTablePageSizeSelect
      value={pageSize}
      options={pageSizeOptions}
      onValueChange={onPageSizeChange}
    />
  );

  return (
    <div className={cn("space-y-6", className)}>
      {children}

      <DashboardTableFooter
        page={safePage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        summary={summary}
        pageSizeControl={pageSizeControl}
      />
    </div>
  );
}
