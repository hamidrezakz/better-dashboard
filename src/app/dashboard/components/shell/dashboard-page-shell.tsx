import { cn } from "@/lib/utils";

type DashboardPageShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function DashboardPageShell({
  children,
  className,
}: DashboardPageShellProps) {
  return (
    <section className={cn("flex flex-1 flex-col gap-4 p-3 sm:p-4 xl:px-6", className)}>
      {children}
    </section>
  );
}
