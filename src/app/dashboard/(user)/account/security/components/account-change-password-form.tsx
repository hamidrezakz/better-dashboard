"use client";

import { useActionState } from "react";
import { changePasswordAction } from "@/app/action/dashboard/users/account/change-password-action";
import { ACCOUNT_PASSWORD_FORM_INITIAL_STATE } from "@/app/action/dashboard/users/account/shared/account-form-state";
import { accountCopy } from "@/app/dashboard/(user)/account/lib/account-copy";
import {
  AccountSectionCard,
  AccountSectionCardBody,
  AccountSectionCardFooter,
} from "@/app/dashboard/(user)/account/components/account-section-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { FormSubmitButton } from "@/components/form/form-submit-button";
import { PasswordInput } from "@/components/form/password-input";

export function AccountChangePasswordForm() {
  const [state, formAction] = useActionState(
    changePasswordAction,
    ACCOUNT_PASSWORD_FORM_INITIAL_STATE,
  );

  return (
    <AccountSectionCard title={accountCopy.security.title}>
      <form action={formAction} noValidate>
        <AccountSectionCardBody className="space-y-4">
          {state.success ? (
            <Alert>
              <AlertDescription>Your password was updated.</AlertDescription>
            </Alert>
          ) : null}
          {state.formError ? (
            <Alert variant="destructive">
              <AlertDescription>{state.formError}</AlertDescription>
            </Alert>
          ) : null}
          <FieldGroup>
            <Field data-invalid={Boolean(state.fieldErrors?.currentPassword)}>
              <FieldLabel htmlFor="currentPassword">
                Current password
              </FieldLabel>
              <PasswordInput
                id="currentPassword"
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
              <FieldLabel htmlFor="newPassword">New password</FieldLabel>
              <PasswordInput
                id="newPassword"
                name="newPassword"
                autoComplete="new-password"
                aria-invalid={Boolean(state.fieldErrors?.newPassword)}
                required
              />
              <FieldError
                errors={[{ message: state.fieldErrors?.newPassword }]}
              />
            </Field>
            <Field data-invalid={Boolean(state.fieldErrors?.confirmPassword)}>
              <FieldLabel htmlFor="confirmPassword">
                Confirm new password
              </FieldLabel>
              <PasswordInput
                id="confirmPassword"
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
        </AccountSectionCardBody>
        <AccountSectionCardFooter>
          <FormSubmitButton
            idleText="Update password"
            loadingText="Updating…"
            className="w-auto min-w-32"
          />
        </AccountSectionCardFooter>
      </form>
    </AccountSectionCard>
  );
}
