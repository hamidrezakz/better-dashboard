import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type LoadingFallbackProps = {
  label?: string;
  className?: string;
};

export function LoadingFallback({ label, className }: LoadingFallbackProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "flex size-full min-h-0 min-w-0 flex-1 flex-col items-center justify-center gap-2 p-4",
        className,
      )}
    >
      <Spinner className="size-6 text-muted-foreground" />
      {label ? (
        <p className="text-center text-sm text-muted-foreground">{label}</p>
      ) : null}
    </div>
  );
}
