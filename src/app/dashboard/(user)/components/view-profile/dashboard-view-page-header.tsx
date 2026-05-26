import { cn } from "@/lib/utils";

type DashboardViewPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
};

export function DashboardViewPageHeader({
  eyebrow,
  title,
  description,
  meta,
  actions,
  className,
}: DashboardViewPageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 space-y-1.5">
        {eyebrow ? (
          <p className="text-xs font-medium text-muted-foreground">{eyebrow}</p>
        ) : null}
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight text-balance sm:text-2xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-prose text-sm text-pretty text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {meta ? (
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-0.5 text-sm text-muted-foreground">
            {meta}
          </div>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </header>
  );
}
