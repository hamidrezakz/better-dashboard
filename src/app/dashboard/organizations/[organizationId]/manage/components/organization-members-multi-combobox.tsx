"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { XIcon } from "lucide-react";
import {
  searchUsersAction,
  type UserSearchOption,
} from "@/app/action/dashboard/users/search-users-action";
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

type SearchOrganizationMembersFn = (
  query: string,
) => Promise<UserSearchOption[]>;

type OrganizationMembersMultiComboboxProps = {
  organizationId: string;
  value: UserSearchOption[];
  onValueChange: (value: UserSearchOption[]) => void;
  excludeUserIds?: string[];
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

export function OrganizationMembersMultiCombobox({
  organizationId,
  value,
  onValueChange,
  excludeUserIds = [],
  disabled,
  placeholder = "Search organization members…",
  className,
}: OrganizationMembersMultiComboboxProps) {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState<UserSearchOption[]>([]);
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedIds = new Set(value.map((user) => user.id));
  const mergedExcludeIds = [
    ...new Set([...excludeUserIds, ...value.map((user) => user.id)]),
  ];

  const searchMembers: SearchOrganizationMembersFn = async (query) => {
    const result = await searchUsersAction({
      query,
      organizationId,
      excludeUserIds: mergedExcludeIds,
    });
    return result.users;
  };

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const query = inputValue.trim();

    if (query.length < MIN_QUERY_LENGTH) {
      setItems([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        const users = await searchMembers(query);
        setItems(users.filter((user) => !selectedIds.has(user.id)));
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [inputValue, mergedExcludeIds.join(","), selectedIds.size]);

  const emptyMessage =
    inputValue.trim().length < MIN_QUERY_LENGTH
      ? "Enter at least 2 characters to search."
      : isPending
        ? "Searching…"
        : "No members found.";

  const addUser = (user: UserSearchOption) => {
    if (selectedIds.has(user.id)) {
      return;
    }

    onValueChange([...value, user]);
    setInputValue("");
    setItems([]);
  };

  const removeUser = (userId: string) => {
    onValueChange(value.filter((user) => user.id !== userId));
  };

  return (
    <div className={cn("space-y-2", className)}>
      {value.length ? (
        <ul className="flex flex-wrap gap-2">
          {value.map((user) => (
            <li
              key={user.id}
              className="flex max-w-full items-center gap-1 rounded-md border border-input bg-muted/40 py-0.5 ps-2 pe-0.5"
            >
              <UserProfileCell
                user={user}
                variant="inline"
                showEmail={false}
                className="min-w-0"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                disabled={disabled}
                aria-label={`Remove ${user.name}`}
                onClick={() => removeUser(user.id)}
              >
                <XIcon />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}

      <Combobox
        items={items}
        value={null}
        onValueChange={(nextValue) => {
          if (!nextValue) {
            return;
          }

          addUser(nextValue as UserSearchOption);
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
