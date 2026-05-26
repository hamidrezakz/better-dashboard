"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { XIcon } from "lucide-react";
import type { UserSearchOption } from "@/app/action/dashboard/users/search-users-action";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { UserProfileCell } from "@/components/user-profile/user-profile-cell";
import { cn } from "@/lib/utils";

const MIN_QUERY_LENGTH = 2;
const SEARCH_DEBOUNCE_MS = 300;

type SearchUsersFn = (query: string) => Promise<UserSearchOption[]>;

type UserSearchComboboxProps = {
  value: UserSearchOption | null;
  onValueChange: (value: UserSearchOption | null) => void;
  searchUsers: SearchUsersFn;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

export function UserSearchCombobox({
  value,
  onValueChange,
  searchUsers,
  disabled,
  placeholder = "Search by name or email…",
  className,
}: UserSearchComboboxProps) {
  const [isSearching, setIsSearching] = useState(() => !value);
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState<UserSearchOption[]>([]);
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchUsersRef = useRef(searchUsers);

  searchUsersRef.current = searchUsers;

  useEffect(() => {
    if (value) {
      setIsSearching(false);
    }
  }, [value]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const query = inputValue.trim();

    if (!isSearching || query.length < MIN_QUERY_LENGTH) {
      setItems([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        const users = await searchUsersRef.current(query);
        setItems(users);
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [inputValue, isSearching]);

  const emptyMessage =
    inputValue.trim().length < MIN_QUERY_LENGTH
      ? "Enter at least 2 characters to search."
      : isPending
        ? "Searching…"
        : "No users found.";

  if (value && !isSearching) {
    return (
      <SelectedUserField
        user={value}
        disabled={disabled}
        className={className}
        onClear={() => {
          onValueChange(null);
          setInputValue("");
          setItems([]);
          setIsSearching(true);
        }}
      />
    );
  }

  return (
    <div className={cn("w-full min-w-0", className)}>
      <Combobox
        items={items}
        value={null}
        onValueChange={(nextValue) => {
          if (!nextValue) {
            return;
          }

          onValueChange(nextValue as UserSearchOption);
          setInputValue("");
          setItems([]);
          setIsSearching(false);
        }}
        onInputValueChange={setInputValue}
        itemToStringLabel={(user: UserSearchOption | null) => user?.name ?? ""}
        isItemEqualToValue={(
          item: UserSearchOption | null,
          selected: UserSearchOption | null,
        ) => item?.id === selected?.id}
        filter={null}
        disabled={disabled}
      >
        <ComboboxInput
          className="w-full"
          placeholder={placeholder}
          disabled={disabled}
          showClear={inputValue.length > 0}
        />
        <ComboboxContent>
          <ComboboxList>
            {items.map((user) => (
              <ComboboxItem key={user.id} value={user} className="py-1.5">
                <UserProfileCell user={user} variant="inline" />
              </ComboboxItem>
            ))}
          </ComboboxList>
          <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

function SelectedUserField({
  user,
  disabled,
  className,
  onClear,
}: {
  user: UserSearchOption;
  disabled?: boolean;
  className?: string;
  onClear: () => void;
}) {
  return (
    <div
      className={cn(
        "flex h-9 w-full items-center gap-2 rounded-md border border-input bg-input/20 px-2 dark:bg-input/30",
        className,
      )}
    >
      <UserProfileCell
        user={user}
        variant="inline"
        showEmail={false}
        className="min-w-0 flex-1"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        disabled={disabled}
        aria-label="Change recipient"
        className="shrink-0"
        onClick={onClear}
      >
        <XIcon />
      </Button>
    </div>
  );
}
