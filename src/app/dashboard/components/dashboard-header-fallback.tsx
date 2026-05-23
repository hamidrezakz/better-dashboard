import { Skeleton } from "@/components/ui/skeleton";

export function DashboardHeaderFallback() {
  return (
    <header className="mt-2 flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center justify-between gap-2 px-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Skeleton className="size-8 shrink-0 rounded-md" />
          <Skeleton className="h-4 w-px shrink-0" />
          <Skeleton className="h-4 w-40 max-w-[50%]" />
        </div>
        <Skeleton className="size-8 shrink-0 rounded-md" />
      </div>
    </header>
  );
}
