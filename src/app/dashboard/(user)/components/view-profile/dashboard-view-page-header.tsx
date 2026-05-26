import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DashboardViewPageHeaderProps = {
  eyebrow?: string;
  eyebrowActions?: ReactNode;
  title: ReactNode;
  description?: string;
  meta?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function DashboardViewPageHeader({
  eyebrow,
  eyebrowActions,
  title,
  description,
  meta,
  actions,
  className,
}: DashboardViewPageHeaderProps) {
  return (
    <header className={cn("space-y-1.5", className)}>
      {eyebrow ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium text-muted-foreground">{eyebrow}</p>
          {eyebrowActions ? (
            <div className="flex shrink-0 items-center">{eyebrowActions}</div>
          ) : null}
        </div>
      ) : null}
      <div
        className={cn(
          "flex flex-row justify-between gap-3",
          description || meta ? "items-start" : "items-center",
        )}
      >
        <div className="min-w-0 flex-1 space-y-1">
          <h1 className="min-w-0 text-xl font-semibold tracking-tight sm:text-2xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-prose text-sm text-pretty text-muted-foreground">
              {description}
            </p>
          ) : null}
          {meta ? (
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-0.5 text-sm text-muted-foreground">
              {meta}
            </div>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </header>
  );
}
