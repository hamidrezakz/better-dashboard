import { LoadingFallback } from "@/components/loading-fallback/loading-fallback";
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
  label?: string;
  className?: string;
  contentClassName?: string;
  loadingClassName?: string;
  showHeader?: boolean;
};

export function CardLoadingFallback({
  label,
  className,
  contentClassName,
  loadingClassName,
  showHeader = true,
}: CardLoadingFallbackProps) {
  return (
    <Card className={className}>
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
        className={cn(
          "flex min-h-40 flex-col p-0",
          !showHeader && "pt-0",
          contentClassName,
        )}
      >
        <LoadingFallback
          className={cn("min-h-0 flex-1 py-6", loadingClassName)}
          label={label}
        />
      </CardContent>
    </Card>
  );
}
