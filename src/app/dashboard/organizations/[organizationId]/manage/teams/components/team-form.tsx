"use client";

import { useEffect, useId, useState } from "react";
import {
  normalizeTeamName,
  validateTeamName,
  type OrganizationTeamItem,
} from "@/app/dashboard/organizations/[organizationId]/manage/teams/lib/team-form-utils";
import { FormLabel } from "@/components/form/form-label";
import { Input } from "@/components/ui/input";

export type TeamFormTarget =
  | { mode: "create" }
  | { mode: "edit"; team: OrganizationTeamItem };

type TeamFormState = {
  name: string;
};

function initialFormState(target: TeamFormTarget | null): TeamFormState | null {
  if (!target) {
    return null;
  }

  if (target.mode === "edit") {
    return { name: target.team.name };
  }

  return { name: "" };
}

export function useTeamForm(target: TeamFormTarget | null) {
  const [form, setForm] = useState<TeamFormState | null>(() =>
    initialFormState(target),
  );

  useEffect(() => {
    setForm(initialFormState(target));
  }, [target]);

  const onChange = (patch: Partial<TeamFormState>) => {
    setForm((current) => (current ? { ...current, ...patch } : current));
  };

  const nameError = form ? validateTeamName(form.name) : null;
  const canSubmit = Boolean(form && !nameError);

  return {
    form,
    onChange,
    isEdit: target?.mode === "edit",
    canSubmit,
    nameError,
  };
}

type TeamFormProps = {
  target: TeamFormTarget | null;
  form: TeamFormState;
  onChange: (patch: Partial<TeamFormState>) => void;
  disabled?: boolean;
};

export function TeamForm({ target, form, onChange, disabled }: TeamFormProps) {
  const fieldId = useId();

  if (!target) {
    return null;
  }

  return (
    <div className="space-y-2">
      <FormLabel htmlFor={`${fieldId}-name`} required>
        Team name
      </FormLabel>
      <Input
        id={`${fieldId}-name`}
        value={form.name}
        disabled={disabled}
        onChange={(event) => onChange({ name: event.target.value })}
        onBlur={() => onChange({ name: normalizeTeamName(form.name) })}
        autoComplete="off"
      />
    </div>
  );
}
