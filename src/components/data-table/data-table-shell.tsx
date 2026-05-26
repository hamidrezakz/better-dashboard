"use client";

import type { ReactNode } from "react";
import { DataTableFooter } from "@/components/data-table/data-table-footer";
import { DataTablePageSizeSelect } from "@/components/data-table/data-table-page-size-select";
import { DATA_TABLE_PAGE_SIZES } from "@/lib/data-table/page-size";
import {
  formatDataTableNumber,
  getDataTableItemRange,
} from "@/lib/data-table/pagination";
import { cn } from "@/lib/utils";

export type DataTableShellProps = {
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

export function DataTableShell({
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DATA_TABLE_PAGE_SIZES,
  countLabel = "item",
  children,
  className,
}: DataTableShellProps) {
  if (totalCount <= 0) {
    return <div className={cn("space-y-6", className)}>{children}</div>;
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(page, totalPages);
  const { start, end } = getDataTableItemRange(safePage, pageSize, totalCount);

  const summary = (
    <span
      aria-label={`${formatDataTableNumber(start)} to ${formatDataTableNumber(end)} of ${formatDataTableNumber(totalCount)} ${countLabel}${totalCount === 1 ? "" : "s"}`}
    >
      {formatDataTableNumber(start)}–{formatDataTableNumber(end)} of{" "}
      {formatDataTableNumber(totalCount)}
    </span>
  );

  const pageSizeControl = (
    <DataTablePageSizeSelect
      value={pageSize}
      options={pageSizeOptions}
      onValueChange={onPageSizeChange}
    />
  );

  return (
    <div className={cn("space-y-6", className)}>
      {children}

      <DataTableFooter
        page={safePage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        summary={summary}
        pageSizeControl={pageSizeControl}
      />
    </div>
  );
}
