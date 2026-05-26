import Link from "next/link";
import { ChevronRightIcon, type LucideIcon } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";

export type DashboardViewNavListItem = {
  id: string;
  href: string;
  title: string;
  description?: string;
  trailing?: React.ReactNode;
};

type DashboardViewNavListProps = {
  items: DashboardViewNavListItem[];
  icon: LucideIcon;
  className?: string;
};

export function DashboardViewNavList({
  items,
  icon: Icon,
  className,
}: DashboardViewNavListProps) {
  return (
    <ItemGroup className={cn("gap-1.5", className)}>
      {items.map((item) => (
        <Item
          key={item.id}
          variant="muted"
          size="sm"
          render={
            <Link
              href={item.href}
              className="flex w-full min-w-0 items-center gap-2 no-underline"
            />
          }
        >
          <ItemMedia
            variant="icon"
            className="size-8 rounded-md bg-background text-muted-foreground ring-1 ring-foreground/7"
          >
            <Icon className="size-3.5" aria-hidden />
          </ItemMedia>
          <ItemContent className="min-w-0">
            <ItemTitle className="text-sm font-medium">{item.title}</ItemTitle>
            {item.description ? (
              <ItemDescription className="text-xs">
                {item.description}
              </ItemDescription>
            ) : null}
          </ItemContent>
          <ItemActions className="shrink-0 text-muted-foreground">
            {item.trailing ?? (
              <ChevronRightIcon className="size-3.5" aria-hidden />
            )}
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  );
}
