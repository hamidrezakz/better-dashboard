"use client";

import { formatDashboardTableNumber } from "@/lib/dashboard-table-pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type DashboardTablePageSizeSelectProps = {
  value: number;
  options: readonly number[];
  onValueChange: (pageSize: number) => void;
  disabled?: boolean;
};

export function DashboardTablePageSizeSelect({
  value,
  options,
  onValueChange,
  disabled,
}: DashboardTablePageSizeSelectProps) {
  const valueString = String(value);

  return (
    <Select
      value={valueString}
      onValueChange={(next) => {
        if (!next) {
          return;
        }
        const parsed = Number.parseInt(next, 10);
        if (Number.isFinite(parsed)) {
          onValueChange(parsed);
        }
      }}
      disabled={disabled}
    >
      <SelectTrigger
        size="sm"
        className="h-6 min-w-14 px-2"
        aria-label="Rows per page"
      >
        <SelectValue>{formatDashboardTableNumber(value)}</SelectValue>
      </SelectTrigger>
      <SelectContent align="end">
        {options.map((size) => (
          <SelectItem key={size} value={String(size)}>
            {formatDashboardTableNumber(size)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
