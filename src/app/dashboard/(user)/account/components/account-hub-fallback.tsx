import { Skeleton } from "@/components/ui/skeleton";

export function AccountHubFallback() {
  return (
    <div className="w-full max-w-xl space-y-6">
      <div className="flex items-center gap-4 rounded-lg border px-4 py-3">
        <Skeleton className="size-12 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32 max-w-full rounded-sm" />
          <Skeleton className="h-3 w-40 max-w-full rounded-sm" />
        </div>
      </div>
      <div className="divide-y rounded-lg border">
        <div className="space-y-2 px-4 py-3">
          <Skeleton className="h-4 w-24 max-w-full rounded-sm" />
          <Skeleton className="h-3 w-48 max-w-full rounded-sm" />
        </div>
        <div className="space-y-2 px-4 py-3">
          <Skeleton className="h-4 w-28 max-w-full rounded-sm" />
          <Skeleton className="h-3 w-52 max-w-full rounded-sm" />
        </div>
      </div>
    </div>
  );
}
