import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type StatCardAction = {
  href: string;
  label: string;
};

type StatCardProps = {
  label: string;
  value: number | string;
  icon: LucideIcon;
  hint?: string;
  action?: StatCardAction;
  className?: string;
};

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  action,
  className,
}: StatCardProps) {
  return (
    <Card size="sm" className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Icon className="size-4 shrink-0" aria-hidden />
          {label}
        </CardTitle>
        {action ? (
          <CardAction>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              nativeButton={false}
              render={<Link href={action.href} />}
            >
              {action.label}
            </Button>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className={hint ? "space-y-1" : undefined}>
        <p className="text-2xl font-semibold tabular-nums">{value}</p>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}

type StatGridColumns = 2 | 3 | 4;

const columnClasses: Record<StatGridColumns, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 xl:grid-cols-4",
};

type StatGridProps = {
  children: React.ReactNode;
  columns?: StatGridColumns;
  className?: string;
};

export function StatGrid({ children, columns = 3, className }: StatGridProps) {
  return (
    <div className={cn("grid gap-4", columnClasses[columns], className)}>
      {children}
    </div>
  );
}
