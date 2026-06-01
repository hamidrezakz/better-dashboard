"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;

type DataTableSearchFieldProps = {
  query?: string;
  placeholder?: string;
  buildPath: (input: { q?: string; page?: number }) => string;
};

export function DataTableSearchField({
  query,
  placeholder = "Search…",
  buildPath,
}: DataTableSearchFieldProps) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState(query ?? "");

  useEffect(() => {
    setInputValue(query ?? "");
  }, [query]);

  useEffect(() => {
    const trimmed = inputValue.trim();
    const normalizedQuery = query?.trim() ?? "";

    if (trimmed === normalizedQuery) {
      return;
    }

    if (trimmed.length > 0 && trimmed.length < MIN_QUERY_LENGTH) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const nextQuery =
        trimmed.length >= MIN_QUERY_LENGTH ? trimmed : undefined;

      if (nextQuery === normalizedQuery || (!nextQuery && !normalizedQuery)) {
        return;
      }

      router.push(
        buildPath({
          q: nextQuery,
          page: 1,
        }),
      );
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [buildPath, inputValue, query, router]);

  return (
    <div className="relative w-full min-w-0 sm:max-w-xs">
      <SearchIcon className="pointer-events-none absolute inset-s-2.5 top-1/2 size-3.5 -translate-y-1/2 opacity-50" />
      <Input
        type="search"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        placeholder={placeholder}
        className="ps-8"
        aria-label={placeholder}
      />
    </div>
  );
}
