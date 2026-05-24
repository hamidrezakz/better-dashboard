"use client";

import type { AccountPasswordFormState } from "@/app/action/dashboard/users/account/shared/account-form-state";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { PasswordInput } from "@/components/form/password-input";

type AccountPasswordFormFieldsProps = {
  formId: string;
  state: AccountPasswordFormState;
};

export function AccountPasswordFormFields({
  formId,
  state,
}: AccountPasswordFormFieldsProps) {
  return (
    <FieldGroup>
      <Field data-invalid={Boolean(state.fieldErrors?.currentPassword)}>
        <FieldLabel htmlFor={`${formId}-currentPassword`}>
          Current password
        </FieldLabel>
        <PasswordInput
          id={`${formId}-currentPassword`}
          name="currentPassword"
          autoComplete="current-password"
          aria-invalid={Boolean(state.fieldErrors?.currentPassword)}
          required
        />
        <FieldError
          errors={[{ message: state.fieldErrors?.currentPassword }]}
        />
      </Field>
      <Field data-invalid={Boolean(state.fieldErrors?.newPassword)}>
        <FieldLabel htmlFor={`${formId}-newPassword`}>New password</FieldLabel>
        <PasswordInput
          id={`${formId}-newPassword`}
          name="newPassword"
          autoComplete="new-password"
          aria-invalid={Boolean(state.fieldErrors?.newPassword)}
          required
        />
        <FieldError errors={[{ message: state.fieldErrors?.newPassword }]} />
      </Field>
      <Field data-invalid={Boolean(state.fieldErrors?.confirmPassword)}>
        <FieldLabel htmlFor={`${formId}-confirmPassword`}>
          Confirm new password
        </FieldLabel>
        <PasswordInput
          id={`${formId}-confirmPassword`}
          name="confirmPassword"
          autoComplete="new-password"
          aria-invalid={Boolean(state.fieldErrors?.confirmPassword)}
          required
        />
        <FieldError
          errors={[{ message: state.fieldErrors?.confirmPassword }]}
        />
      </Field>
    </FieldGroup>
  );
}
