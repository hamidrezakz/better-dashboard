"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  JOIN_SCOPE_OPTIONS,
  invitationJoinScopeToggleLabels,
} from "@/app/dashboard/organizations/[organizationId]/manage/invitations/lib/invitation-labels";
import {
  getDefaultInvitationFormState,
  invitationToFormState,
  isInvitationFormValid,
  joinScopeRequiresTeam,
  TEAM_NONE_VALUE,
  type InvitationFormState,
  type InvitationJoinScopeOption,
  type OrganizationInvitationItem,
} from "@/app/dashboard/organizations/[organizationId]/manage/invitations/lib/invitation-form-utils";
import { FormLabel } from "@/components/form/form-label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type InvitationFormTarget =
  | { mode: "create" }
  | { mode: "edit"; invitation: OrganizationInvitationItem };

export function useInvitationForm(target: InvitationFormTarget | null) {
  const [form, setForm] = useState<InvitationFormState | null>(null);
  const isEdit = target?.mode === "edit";

  useEffect(() => {
    if (!target) {
      setForm(null);
      return;
    }

    setForm(
      target.mode === "edit"
        ? invitationToFormState(target.invitation)
        : getDefaultInvitationFormState(),
    );
  }, [target]);

  const onChange = (patch: Partial<InvitationFormState>) => {
    setForm((previous) => (previous ? { ...previous, ...patch } : previous));
  };

  return {
    form,
    onChange,
    isEdit,
    canSubmit: Boolean(form && isInvitationFormValid(form)),
  };
}

export type InvitationFormProps = {
  form: InvitationFormState;
  teams: Array<{ id: string; name: string }>;
  disabled?: boolean;
  onChange: (patch: Partial<InvitationFormState>) => void;
};

export function InvitationForm({
  form,
  teams,
  disabled,
  onChange,
}: InvitationFormProps) {
  const fieldId = useId();
  const teamNameById = useMemo(
    () => new Map(teams.map((team) => [team.id, team.name])),
    [teams],
  );

  const showTeam = joinScopeRequiresTeam(form.joinScope);

  return (
    <div className="space-y-6">
      <fieldset className="space-y-2" disabled={disabled}>
        <legend className="text-xs font-medium">محدوده پیوستن</legend>
        <ToggleGroup
          value={[form.joinScope]}
          onValueChange={(values) => {
            const joinScope = values[0] as
              | InvitationJoinScopeOption
              | undefined;
            if (!joinScope) {
              return;
            }

            onChange({
              joinScope,
              teamId:
                joinScope === "organization" ? TEAM_NONE_VALUE : form.teamId,
            });
          }}
          variant="outline"
          size="sm"
          spacing={0}
          className="grid w-full grid-cols-3"
          disabled={disabled}
        >
          {JOIN_SCOPE_OPTIONS.map((option) => (
            <ToggleGroupItem
              key={option}
              value={option}
              className="w-full px-1"
            >
              {invitationJoinScopeToggleLabels[option]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        {showTeam ? (
          <div className="space-y-2">
            <FormLabel htmlFor={`${fieldId}-team`} required>
              تیم
            </FormLabel>
            <Select
              value={form.teamId}
              onValueChange={(value) => {
                if (!value) {
                  return;
                }
                onChange({ teamId: value });
              }}
              disabled={disabled}
            >
              <SelectTrigger id={`${fieldId}-team`} className="w-full">
                <SelectValue placeholder="انتخاب تیم">
                  {form.teamId === TEAM_NONE_VALUE
                    ? "انتخاب تیم"
                    : (teamNameById.get(form.teamId) ?? "انتخاب تیم")}
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

        <div className="space-y-2">
          <FormLabel htmlFor={`${fieldId}-expiry`} required>
            تاریخ انقضا
          </FormLabel>
          <Input
            id={`${fieldId}-expiry`}
            type="date"
            value={form.expiresAt}
            disabled={disabled}
            onChange={(event) => onChange({ expiresAt: event.target.value })}
          />
        </div>

        <div className="space-y-2">
          <FormLabel htmlFor={`${fieldId}-max-uses`}>حداکثر استفاده</FormLabel>
          <Input
            id={`${fieldId}-max-uses`}
            type="number"
            min={1}
            value={form.maxUses}
            disabled={disabled}
            onChange={(event) => onChange({ maxUses: event.target.value })}
            placeholder="نامحدود"
          />
        </div>
      </div>
    </div>
  );
}
