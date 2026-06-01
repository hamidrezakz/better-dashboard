"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { searchUsersAction } from "@/app/action/dashboard/users/search-users-action";
import type { UserSearchOption } from "@/app/action/dashboard/users/search-users-action";
import {
  NOTIFICATION_AUDIENCE_OPTIONS,
  notificationAudienceLabels,
} from "@/app/dashboard/organizations/[organizationId]/manage/notifications/lib/notification-labels";
import {
  audienceNeedsTeam,
  audienceNeedsUser,
  getDefaultNotificationFormState,
  isNotificationFormValid,
  type NotificationFormState,
} from "@/app/dashboard/organizations/[organizationId]/manage/notifications/lib/notification-form-utils";
import { FormLabel } from "@/components/form/form-label";
import { UserSearchCombobox } from "@/components/user-search";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { NotificationAudience } from "@/generated/prisma/enums";

export type NotificationFormTarget = { mode: "create" };

export function useNotificationForm(target: NotificationFormTarget | null) {
  const [form, setForm] = useState<NotificationFormState | null>(null);

  useEffect(() => {
    if (!target) {
      setForm(null);
      return;
    }

    setForm(getDefaultNotificationFormState());
  }, [target]);

  const onChange = (patch: Partial<NotificationFormState>) => {
    setForm((previous) => (previous ? { ...previous, ...patch } : previous));
  };

  return {
    form,
    onChange,
    canSubmit: Boolean(form && isNotificationFormValid(form)),
  };
}

export type NotificationFormProps = {
  organizationId: string;
  form: NotificationFormState;
  teams: Array<{ id: string; name: string }>;
  disabled?: boolean;
  onChange: (patch: Partial<NotificationFormState>) => void;
};

export function NotificationForm({
  organizationId,
  form,
  teams,
  disabled,
  onChange,
}: NotificationFormProps) {
  const fieldId = useId();
  const teamNameById = useMemo(
    () => new Map(teams.map((team) => [team.id, team.name])),
    [teams],
  );

  const showUser = audienceNeedsUser(form.audience);
  const showTeam = audienceNeedsTeam(form.audience);

  const searchOrganizationUsers = (query: string) =>
    searchUsersAction({ query, organizationId }).then((result) => result.users);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <FormLabel htmlFor={`${fieldId}-title`} required>
          عنوان
        </FormLabel>
        <Input
          id={`${fieldId}-title`}
          value={form.title}
          disabled={disabled}
          onChange={(event) => onChange({ title: event.target.value })}
          placeholder="عنوان اعلان"
        />
      </div>

      <div className="space-y-2">
        <FormLabel htmlFor={`${fieldId}-body`}>متن</FormLabel>
        <Textarea
          id={`${fieldId}-body`}
          value={form.body}
          disabled={disabled}
          onChange={(event) => onChange({ body: event.target.value })}
          placeholder="متن اعلان (اختیاری)"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <FormLabel htmlFor={`${fieldId}-audience`} required>
          مخاطب
        </FormLabel>
        <Select
          value={form.audience}
          onValueChange={(value) => {
            if (!value) {
              return;
            }

            onChange({
              audience: value as NotificationAudience,
              selectedUser: null,
              teamId: "",
            });
          }}
          disabled={disabled}
        >
          <SelectTrigger id={`${fieldId}-audience`} className="w-full">
            <SelectValue>
              {notificationAudienceLabels[form.audience]}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {NOTIFICATION_AUDIENCE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {notificationAudienceLabels[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showUser ? (
        <div className="space-y-2">
          <FormLabel htmlFor={`${fieldId}-user`} required>
            کاربر
          </FormLabel>
          <UserSearchCombobox
            value={form.selectedUser}
            onValueChange={(selectedUser: UserSearchOption | null) =>
              onChange({ selectedUser })
            }
            searchUsers={searchOrganizationUsers}
            disabled={disabled}
          />
        </div>
      ) : null}

      {showTeam ? (
        <div className="space-y-2">
          <FormLabel htmlFor={`${fieldId}-team`} required>
            تیم
          </FormLabel>
          <Select
            value={form.teamId}
            onValueChange={(value) => onChange({ teamId: value ?? "" })}
            disabled={disabled}
          >
            <SelectTrigger id={`${fieldId}-team`} className="w-full">
              <SelectValue placeholder="انتخاب تیم">
                {form.teamId
                  ? (teamNameById.get(form.teamId) ?? "انتخاب تیم")
                  : undefined}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}
    </div>
  );
}
