import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type TableLoadingFallbackProps = {
  className?: string;
  contentClassName?: string;
  rows?: number;
  showHeader?: boolean;
  showHeaderAction?: boolean;
  showFooter?: boolean;
};

function TableRowSkeleton({ index }: { index: number }) {
  return (
    <div
      className="flex items-center gap-3 border-b border-border/60 px-4 py-3 last:border-b-0"
      aria-hidden
    >
      <Skeleton
        className={cn(
          "size-8 shrink-0 rounded-full",
          index % 3 === 0 ? "rounded-md" : "rounded-full",
        )}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Skeleton
          className={cn(
            "h-3.5 max-w-full rounded-sm",
            index % 2 === 0 ? "w-3/5" : "w-2/5",
          )}
        />
        <Skeleton className="hidden h-3 w-2/5 max-w-full rounded-sm sm:block" />
      </div>
      <Skeleton className="hidden h-5 w-14 shrink-0 rounded-full lg:block" />
      <Skeleton className="hidden h-3.5 w-20 shrink-0 rounded-sm lg:block" />
      <Skeleton className="size-8 shrink-0 rounded-md" />
    </div>
  );
}

export function TableLoadingFallback({
  className,
  contentClassName,
  rows = 5,
  showHeader = true,
  showHeaderAction = true,
  showFooter = true,
}: TableLoadingFallbackProps) {
  return (
    <Card className={className} aria-busy="true" aria-live="polite">
      {showHeader ? (
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-4 w-28 max-w-full rounded-sm" />
          </CardTitle>
          {showHeaderAction ? (
            <CardAction>
              <Skeleton className="h-8 w-32 max-w-full rounded-md" />
            </CardAction>
          ) : null}
        </CardHeader>
      ) : null}

      <CardContent className={cn("space-y-6", contentClassName)}>
        <div className="overflow-hidden rounded-lg border border-border/60">
          <div
            className="hidden items-center gap-3 border-b border-border/60 bg-muted/30 px-4 py-2.5 sm:flex"
            aria-hidden
          >
            <Skeleton className="h-3 w-24 rounded-sm" />
            <Skeleton className="h-3 w-32 rounded-sm" />
            <Skeleton className="ms-auto h-3 w-12 rounded-sm" />
            <Skeleton className="h-3 w-16 rounded-sm" />
            <Skeleton className="h-3 w-8 rounded-sm" />
          </div>

          {Array.from({ length: rows }, (_, index) => (
            <TableRowSkeleton key={index} index={index} />
          ))}
        </div>

        {showFooter ? (
          <div
            className="flex flex-wrap items-center justify-between gap-x-2 gap-y-2"
            aria-hidden
          >
            <Skeleton className="h-3.5 w-28 rounded-sm" />
            <Skeleton className="h-8 w-44 max-w-full rounded-md" />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
