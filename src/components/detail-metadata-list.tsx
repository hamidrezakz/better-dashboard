import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DetailMetadataListProps = {
  children: ReactNode;
  className?: string;
};

export function DetailMetadataList({
  children,
  className,
}: DetailMetadataListProps) {
  return (
    <div className={cn("flex flex-col gap-2.5 text-sm", className)}>
      {children}
    </div>
  );
}

type DetailMetadataRowProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

export function DetailMetadataRow({
  label,
  children,
  className,
}: DetailMetadataRowProps) {
  return (
    <div className={cn("flex items-baseline gap-2 py-0.5", className)}>
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span
        className="min-h-px min-w-6 flex-1 border-b border-dotted border-border/80"
        aria-hidden
      />
      <div className="min-w-0 shrink-0 text-end">{children}</div>
    </div>
  );
}
