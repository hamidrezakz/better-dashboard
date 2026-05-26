import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function StatCardFallback({ className }: { className?: string }) {
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
