import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type PageTitleLoadingFallbackProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

const titleSizes = {
  sm: "h-5 w-48",
  md: "h-6 w-56",
  lg: "h-7 w-64",
} as const;

export function PageTitleLoadingFallback({
  className,
  size = "sm",
}: PageTitleLoadingFallbackProps) {
  return (
    <Skeleton
      className={cn("max-w-full rounded-sm", titleSizes[size], className)}
      aria-busy="true"
      aria-live="polite"
    />
  );
}

type ManagePageHeaderLoadingFallbackProps = {
  className?: string;
  showBackLink?: boolean;
  showActions?: boolean;
  actionCount?: number;
};

export function ManagePageHeaderLoadingFallback({
  className,
  showBackLink = true,
  showActions = false,
  actionCount = 2,
}: ManagePageHeaderLoadingFallbackProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
      aria-busy="true"
      aria-live="polite"
    >
      <div className="space-y-2">
        {showBackLink ? (
          <Skeleton className="h-8 w-28 max-w-full rounded-md" />
        ) : null}
        <Skeleton className="h-7 w-56 max-w-full rounded-sm" />
      </div>

      {showActions ? (
        <div className="flex flex-wrap gap-2" aria-hidden>
          {Array.from({ length: actionCount }, (_, index) => (
            <Skeleton
              key={index}
              className={cn("h-8 rounded-md", index === 0 ? "w-20" : "w-24")}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
