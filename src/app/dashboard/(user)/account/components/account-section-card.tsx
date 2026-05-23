import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type AccountSectionCardProps = {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function AccountSectionCard({
  title,
  action,
  children,
  className,
}: AccountSectionCardProps) {
  return (
    <Card className={cn("gap-0", className)}>
      <CardHeader className="border-b">
        <CardTitle>{title}</CardTitle>
        {action ? <CardAction>{action}</CardAction> : null}
      </CardHeader>
      {children}
    </Card>
  );
}

export function AccountSectionCardBody({
  className,
  ...props
}: React.ComponentProps<typeof CardContent>) {
  return <CardContent className={cn("py-5", className)} {...props} />;
}

export function AccountSectionCardFooter({
  className,
  ...props
}: React.ComponentProps<typeof CardFooter>) {
  return (
    <CardFooter className={cn("justify-end border-t", className)} {...props} />
  );
}

export function AccountSectionCardFallback({
  className,
  contentClassName,
}: {
  className?: string;
  contentClassName?: string;
}) {
  return (
    <Card className={cn("gap-0", className)}>
      <CardHeader className="border-b">
        <CardTitle>
          <Skeleton className="h-4 w-32 max-w-full rounded-sm" />
        </CardTitle>
      </CardHeader>
      <CardContent className={cn("space-y-3 py-5", contentClassName)}>
        <Skeleton className="h-9 w-full rounded-md" />
        <Skeleton className="h-9 w-full rounded-md" />
        <Skeleton className="h-9 w-3/4 max-w-full rounded-md" />
      </CardContent>
    </Card>
  );
}
