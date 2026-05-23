"use client";

import type { ReactNode } from "react";
import { buildDashboardTablePageNumbers } from "@/lib/dashboard-table-pagination";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export type DashboardTableFooterProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Item range on the current page (start of footer) */
  range?: ReactNode;
  /** Total count label (end of footer) */
  total?: ReactNode;
  className?: string;
};

export function DashboardTableFooter({
  page,
  totalPages,
  onPageChange,
  range,
  total,
  className,
}: DashboardTableFooterProps) {
  const showPagination = totalPages > 1;

  if (!showPagination && !range && !total) {
    return null;
  }

  const atFirst = page <= 1;
  const atLast = page >= totalPages;

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-2 text-xs text-muted-foreground tabular-nums",
        className,
      )}
    >
      {range ? <div className="shrink-0 me-1">{range}</div> : null}
      {showPagination ? (
        <Pagination className="w-auto shrink-0">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                text="Previous"
                onClick={() => onPageChange(Math.max(1, page - 1))}
                aria-disabled={atFirst}
                className={atFirst ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {buildDashboardTablePageNumbers(page, totalPages).map(
              (num, index) =>
                num === "..." ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={num}>
                    <PaginationLink
                      isActive={num === page}
                      onClick={() => onPageChange(num)}
                    >
                      {num}
                    </PaginationLink>
                  </PaginationItem>
                ),
            )}

            <PaginationItem>
              <PaginationNext
                text="Next"
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                aria-disabled={atLast}
                className={atLast ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
      {total ? <div className="shrink-0">{total}</div> : null}
    </div>
  );
}
