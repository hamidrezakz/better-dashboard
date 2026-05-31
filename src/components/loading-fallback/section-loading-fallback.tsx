import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SectionLoadingFallbackProps = {
  className?: string;
  variant?: "list" | "cards";
  itemCount?: number;
};

function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2.5">
      <Skeleton className="size-8 shrink-0 rounded-md" />
      <Skeleton className="h-3.5 flex-1 max-w-xs rounded-sm" />
      <Skeleton className="size-3.5 shrink-0 rounded-sm" />
    </div>
  );
}

function WorkspaceCardSkeleton() {
  return (
    <Card size="sm" className="h-full">
      <CardHeader className="border-b border-border/60 [.border-b]:pb-3">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 shrink-0 rounded-md" />
          <Skeleton className="h-4 flex-1 max-w-[10rem] rounded-sm" />
          <Skeleton className="h-5 w-14 shrink-0 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-4">
        <Skeleton className="h-8 w-full rounded-md" />
        <Skeleton className="h-8 w-4/5 rounded-md" />
      </CardContent>
    </Card>
  );
}

export function SectionLoadingFallback({
  className,
  variant = "list",
  itemCount = variant === "cards" ? 2 : 3,
}: SectionLoadingFallbackProps) {
  return (
    <section
      className={cn("space-y-3", className)}
      aria-busy="true"
      aria-live="polite"
    >
      <Skeleton className="h-4 w-32 max-w-full rounded-sm" />

      {variant === "cards" ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: itemCount }, (_, index) => (
            <li key={index}>
              <WorkspaceCardSkeleton />
            </li>
          ))}
        </ul>
      ) : (
        <div className="space-y-1.5">
          {Array.from({ length: itemCount }, (_, index) => (
            <ListItemSkeleton key={index} />
          ))}
        </div>
      )}
    </section>
  );
}
