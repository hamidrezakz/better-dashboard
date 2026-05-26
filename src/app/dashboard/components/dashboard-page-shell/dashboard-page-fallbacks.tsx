import { CardLoadingFallback } from "@/components/loading-fallback";
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
