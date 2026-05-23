"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

export type DashboardTableSegmentOption<T extends string> = {
  value: T;
  label: string;
};

type DashboardTableSegmentFilterProps<T extends string> = {
  value: T;
  options: readonly DashboardTableSegmentOption<T>[];
  onValueChange: (value: T) => void;
};

export function DashboardTableSegmentFilter<T extends string>({
  value,
  options,
  onValueChange,
}: DashboardTableSegmentFilterProps<T>) {
  return (
    <ButtonGroup className="shrink-0">
      {options.map((option) => (
        <Button
          key={option.value}
          size="sm"
          variant={value === option.value ? "default" : "outline"}
          onClick={() => onValueChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </ButtonGroup>
  );
}
