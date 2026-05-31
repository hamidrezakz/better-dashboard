import {
  ManagePageHeaderLoadingFallback,
  PageTitleLoadingFallback,
  SectionLoadingFallback,
  TableLoadingFallback,
} from "@/components/loading-fallback";
import { StatCardFallback, StatGrid } from "@/components/stat-card";
import { cn } from "@/lib/utils";

export function DashboardPageTitleFallback({
  className,
}: {
  className?: string;
}) {
  return <PageTitleLoadingFallback className={className} size="sm" />;
}

export function DashboardTableCardFallback({
  className,
}: {
  className?: string;
}) {
  return (
    <TableLoadingFallback
      className={cn("w-full", className)}
      contentClassName="min-h-[40vh]"
    />
  );
}

export function DashboardSectionCardFallback({
  className,
  variant = "list",
}: {
  className?: string;
  variant?: "list" | "cards";
}) {
  return (
    <SectionLoadingFallback
      className={cn("w-full", className)}
      variant={variant}
    />
  );
}

export function DashboardTeamDetailFallback() {
  return (
    <div className="space-y-4">
      <ManagePageHeaderLoadingFallback showActions actionCount={2} />
      <StatGrid columns={4}>
        <StatCardFallback />
        <StatCardFallback />
        <StatCardFallback />
        <StatCardFallback />
      </StatGrid>
      <TableLoadingFallback />
    </div>
  );
}
