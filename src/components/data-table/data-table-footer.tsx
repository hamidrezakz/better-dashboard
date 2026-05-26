"use client";

import type { ReactNode } from "react";
import { buildDataTablePageNumbers } from "@/lib/data-table/pagination";
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

export type DataTableFooterProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Item range summary on the start side, e.g. `1–20 of 150` */
  summary?: ReactNode;
  /** Page size control on the end side */
  pageSizeControl?: ReactNode;
  className?: string;
};

export function DataTableFooter({
  page,
  totalPages,
  onPageChange,
  summary,
  pageSizeControl,
  className,
}: DataTableFooterProps) {
  const showPagination = totalPages > 1;

  if (!summary && !pageSizeControl && !showPagination) {
    return null;
  }

  const atFirst = page <= 1;
  const atLast = page >= totalPages;

  return (
    <div
      className={cn(
        "flex w-full flex-wrap items-center justify-between gap-x-2 gap-y-2 text-xs text-muted-foreground tabular-nums",
        className,
      )}
    >
      {summary ? (
        <div className="shrink-0 max-sm:order-1">{summary}</div>
      ) : null}
      {showPagination ? (
        <Pagination className="w-auto shrink-0 max-sm:order-3 max-sm:basis-full max-sm:justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                text="Previous"
                onClick={() => onPageChange(Math.max(1, page - 1))}
                aria-disabled={atFirst}
                className={atFirst ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {buildDataTablePageNumbers(page, totalPages).map((num, index) =>
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
      {pageSizeControl ? (
        <div className="shrink-0 max-sm:order-2 max-sm:ms-auto">
          {pageSizeControl}
        </div>
      ) : null}
    </div>
  );
}
