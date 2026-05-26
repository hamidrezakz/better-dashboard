"use client";

import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

export type DataTableSegmentOption<T extends string> = {
  value: T;
  label: string;
  icon?: LucideIcon;
};

type DataTableSegmentFilterProps<T extends string> = {
  value: T;
  options: readonly DataTableSegmentOption<T>[];
  onValueChange: (value: T) => void;
};

export function DataTableSegmentFilter<T extends string>({
  value,
  options,
  onValueChange,
}: DataTableSegmentFilterProps<T>) {
  return (
    <ButtonGroup className="shrink-0">
      {options.map((option) => {
        const Icon = option.icon;

        return (
          <Button
            key={option.value}
            size="sm"
            variant={value === option.value ? "default" : "outline"}
            onClick={() => onValueChange(option.value)}
          >
            {Icon ? <Icon data-icon="inline-start" /> : null}
            {option.label}
          </Button>
        );
      })}
    </ButtonGroup>
  );
}
