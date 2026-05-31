import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type CardLoadingFallbackProps = {
  className?: string;
  contentClassName?: string;
  showHeader?: boolean;
  lines?: number;
};

export function CardLoadingFallback({
  className,
  contentClassName,
  showHeader = true,
  lines = 3,
}: CardLoadingFallbackProps) {
  return (
    <Card className={className} aria-busy="true" aria-live="polite">
      {showHeader ? (
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-4 w-36 max-w-full rounded-sm" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-3.5 w-full max-w-sm rounded-sm" />
          </CardDescription>
        </CardHeader>
      ) : null}
      <CardContent
        className={cn("space-y-3", !showHeader && "pt-6", contentClassName)}
      >
        {Array.from({ length: lines }, (_, index) => (
          <Skeleton
            key={index}
            className={cn(
              "h-3.5 max-w-full rounded-sm",
              index === 0 ? "w-full" : index === lines - 1 ? "w-2/3" : "w-4/5",
            )}
          />
        ))}
      </CardContent>
    </Card>
  );
}
