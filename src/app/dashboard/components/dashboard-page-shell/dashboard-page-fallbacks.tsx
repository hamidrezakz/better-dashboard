import { CardLoadingFallback } from "@/components/loading-fallback";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function DashboardTableCardFallback({
  className,
  label,
}: {
  className?: string;
  label?: string;
}) {
  return (
    <CardLoadingFallback
      className={cn("w-full", className)}
      contentClassName="min-h-[40vh]"
      label={label}
    />
  );
}

export function DashboardStatCardFallback({
  className,
}: {
  className?: string;
}) {
  return (
    <Card size="sm" className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Skeleton className="size-4 shrink-0 rounded-sm" />
          <Skeleton className="h-3.5 w-16 max-w-full rounded-sm" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-12 rounded-sm" />
      </CardContent>
    </Card>
  );
}

export function DashboardPageTitleFallback({
  className,
}: {
  className?: string;
}) {
  return (
    <Skeleton className={cn("h-5 w-48 max-w-full rounded-sm", className)} />
  );
}

export function DashboardOrganizationsCardFallback() {
  return <DashboardTableCardFallback />;
}
