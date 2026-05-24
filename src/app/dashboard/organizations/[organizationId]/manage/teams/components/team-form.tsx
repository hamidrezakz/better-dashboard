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

type TeamFormTouched = {
  name: boolean;
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

function initialTouched(target: TeamFormTarget | null): TeamFormTouched {
  return { name: target?.mode === "edit" };
}

export function useTeamForm(target: TeamFormTarget | null) {
  const [form, setForm] = useState<TeamFormState | null>(() =>
    initialFormState(target),
  );
  const [touched, setTouched] = useState<TeamFormTouched>(() =>
    initialTouched(target),
  );
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    setForm(initialFormState(target));
    setTouched(initialTouched(target));
    setSubmitAttempted(false);
  }, [target]);

  const onChange = (patch: Partial<TeamFormState>) => {
    setForm((current) => (current ? { ...current, ...patch } : current));
  };

  const markNameTouched = () => {
    setTouched((current) => ({ ...current, name: true }));
  };

  const nameError = form ? validateTeamName(form.name) : null;
  const displayNameError =
    form && (touched.name || submitAttempted) ? nameError : null;
  const canSubmit = Boolean(form && !nameError);

  const attemptSubmit = () => {
    setSubmitAttempted(true);
    setTouched((current) => ({ ...current, name: true }));
    return canSubmit;
  };

  return {
    form,
    onChange,
    markNameTouched,
    attemptSubmit,
    isEdit: target?.mode === "edit",
    canSubmit,
    displayNameError,
  };
}

type TeamFormProps = {
  target: TeamFormTarget | null;
  form: TeamFormState;
  onChange: (patch: Partial<TeamFormState>) => void;
  onNameBlur: () => void;
  disabled?: boolean;
  nameError?: string | null;
  nameErrorId?: string;
};

export function TeamForm({
  target,
  form,
  onChange,
  onNameBlur,
  disabled,
  nameError,
  nameErrorId,
}: TeamFormProps) {
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
        aria-invalid={Boolean(nameError)}
        aria-describedby={nameError ? nameErrorId : undefined}
        onChange={(event) => onChange({ name: event.target.value })}
        onBlur={() => {
          onChange({ name: normalizeTeamName(form.name) });
          onNameBlur();
        }}
        autoComplete="off"
      />
      {nameError ? (
        <p id={nameErrorId} className="text-sm text-destructive">
          {nameError}
        </p>
      ) : null}
    </div>
  );
}
