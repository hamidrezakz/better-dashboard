import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DashboardTableViewportProps = {
  children: ReactNode;
  allowHorizontalScroll?: boolean;
  className?: string;
};

export function DashboardTableViewport({
  children,
  allowHorizontalScroll = false,
  className,
}: DashboardTableViewportProps) {
  return (
    <div
      className={cn(
        "min-w-0",
        allowHorizontalScroll
          ? "**:data-[slot=table-container]:overflow-x-auto"
          : "**:data-[slot=table-container]:overflow-x-hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}
