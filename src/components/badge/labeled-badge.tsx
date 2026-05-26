import { Badge } from "@/components/ui/badge";
import type { ReactElement } from "react";

export type LabeledBadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline";

export type LabeledBadgeConfig = {
  label: string;
  variant: LabeledBadgeVariant;
  icon: ReactElement;
};

export function LabeledBadge({ label, variant, icon }: LabeledBadgeConfig) {
  return (
    <Badge variant={variant}>
      {icon}
      {label}
    </Badge>
  );
}
