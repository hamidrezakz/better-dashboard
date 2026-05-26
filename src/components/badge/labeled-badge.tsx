import { Badge } from "@/components/ui/badge";
import type { ReactElement } from "react";

export type GlobalBadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline";

export type GlobalBadgeConfig = {
  label: string;
  variant: GlobalBadgeVariant;
  icon: ReactElement;
};

export function GlobalBadge({ label, variant, icon }: GlobalBadgeConfig) {
  return (
    <Badge variant={variant}>
      {icon}
      {label}
    </Badge>
  );
}
