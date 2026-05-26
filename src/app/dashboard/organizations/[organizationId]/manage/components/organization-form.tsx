"use client";

import { useEffect, useId, useState } from "react";
import { OrganizationAvatar } from "@/components/organization/organization-avatar";
import {
  normalizeOrganizationLogo,
  normalizeOrganizationName,
  validateOrganizationLogo,
  validateOrganizationName,
  type OrganizationBranding,
} from "@/app/dashboard/organizations/[organizationId]/manage/lib/organization-form-utils";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import { FormLabel } from "@/components/form/form-label";
import { Input } from "@/components/ui/input";

type OrganizationFormState = {
  name: string;
  logo: string;
};

type OrganizationFormTouched = {
  name: boolean;
  logo: boolean;
};

function initialFormState(
  organization: OrganizationBranding | null,
): OrganizationFormState | null {
  if (!organization) {
    return null;
  }

  return {
    name: organization.name,
    logo: organization.logo ?? "",
  };
}

export function useOrganizationForm(organization: OrganizationBranding | null) {
  const [form, setForm] = useState<OrganizationFormState | null>(() =>
    initialFormState(organization),
  );
  const [touched, setTouched] = useState<OrganizationFormTouched>({
    name: false,
    logo: false,
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    setForm(initialFormState(organization));
    setTouched({ name: false, logo: false });
    setSubmitAttempted(false);
  }, [organization]);

  const onChange = (patch: Partial<OrganizationFormState>) => {
    setForm((current) => (current ? { ...current, ...patch } : current));
  };

  const markNameTouched = () => {
    setTouched((current) => ({ ...current, name: true }));
  };

  const markLogoTouched = () => {
    setTouched((current) => ({ ...current, logo: true }));
  };

  const nameError = form ? validateOrganizationName(form.name) : null;
  const logoError = form ? validateOrganizationLogo(form.logo) : null;
  const displayNameError =
    form && (touched.name || submitAttempted) ? nameError : null;
  const displayLogoError =
    form && (touched.logo || submitAttempted) ? logoError : null;
  const canSubmit = Boolean(form && !nameError && !logoError);

  const attemptSubmit = () => {
    setSubmitAttempted(true);
    setTouched({ name: true, logo: true });
    return canSubmit;
  };

  return {
    form,
    onChange,
    markNameTouched,
    markLogoTouched,
    canSubmit,
    attemptSubmit,
    displayNameError,
    displayLogoError,
  };
}

type OrganizationFormProps = {
  organization: OrganizationBranding;
  form: OrganizationFormState;
  onChange: (patch: Partial<OrganizationFormState>) => void;
  onNameBlur: () => void;
  onLogoBlur: () => void;
  disabled?: boolean;
  nameError?: string | null;
  logoError?: string | null;
  nameErrorId?: string;
  logoErrorId?: string;
};

export function OrganizationForm({
  organization,
  form,
  onChange,
  onNameBlur,
  onLogoBlur,
  disabled,
  nameError,
  logoError,
  nameErrorId,
  logoErrorId,
}: OrganizationFormProps) {
  const fieldId = useId();
  const labels = dashboardNavLabels.organizationManage;
  const previewLogo = form.logo.trim() || organization.logo || "";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <OrganizationAvatar
          name={form.name || organization.name}
          logo={previewLogo}
          className="size-14"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {form.name || organization.name}
          </p>
          <p className="text-sm text-muted-foreground">
            {labels.editOrganization}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <FormLabel htmlFor={`${fieldId}-name`} required>
            {labels.organizationName}
          </FormLabel>
          <Input
            id={`${fieldId}-name`}
            value={form.name}
            disabled={disabled}
            aria-invalid={Boolean(nameError)}
            aria-describedby={nameError ? nameErrorId : undefined}
            onChange={(event) => onChange({ name: event.target.value })}
            onBlur={() => {
              onChange({ name: normalizeOrganizationName(form.name) });
              onNameBlur();
            }}
            autoComplete="organization"
          />
          {nameError ? (
            <p id={nameErrorId} className="text-sm text-destructive">
              {nameError}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <FormLabel htmlFor={`${fieldId}-logo`}>
            {labels.organizationLogo}
          </FormLabel>
          <Input
            id={`${fieldId}-logo`}
            type="url"
            value={form.logo}
            disabled={disabled}
            placeholder="https://"
            aria-invalid={Boolean(logoError)}
            aria-describedby={logoError ? logoErrorId : undefined}
            onChange={(event) => onChange({ logo: event.target.value })}
            onBlur={() => {
              onChange({ logo: normalizeOrganizationLogo(form.logo) });
              onLogoBlur();
            }}
          />
          <p className="text-sm text-muted-foreground">
            {labels.organizationLogoHint}
          </p>
          {logoError ? (
            <p id={logoErrorId} className="text-sm text-destructive">
              {logoError}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
