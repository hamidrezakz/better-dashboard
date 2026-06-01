"use client";

import { formatDataTableNumber } from "@/lib/data-table/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type DataTablePageSizeSelectProps = {
  value: number;
  options: readonly number[];
  onValueChange: (pageSize: number) => void;
  disabled?: boolean;
};

export function DataTablePageSizeSelect({
  value,
  options,
  onValueChange,
  disabled,
}: DataTablePageSizeSelectProps) {
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
        aria-label="تعداد در هر صفحه"
      >
        <SelectValue>{formatDataTableNumber(value)}</SelectValue>
      </SelectTrigger>
      <SelectContent align="end">
        {options.map((size) => (
          <SelectItem key={size} value={String(size)}>
            {formatDataTableNumber(size)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
