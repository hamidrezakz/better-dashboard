import { cn } from "@/lib/utils";

type DashboardViewSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function DashboardViewSection({
  title,
  description,
  children,
  className,
}: DashboardViewSectionProps) {
  return (
    <section className={cn("space-y-3", className)}>
      <div className="space-y-0.5">
        <h2 className="text-sm font-medium">{title}</h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
