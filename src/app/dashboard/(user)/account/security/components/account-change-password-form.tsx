"use client";

import { useActionState } from "react";
import { changePasswordAction } from "@/app/action/dashboard/users/account/change-password-action";
import { ACCOUNT_PASSWORD_FORM_INITIAL_STATE } from "@/app/action/dashboard/users/account/shared/account-form-state";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { FormSubmitButton } from "@/components/form/form-submit-button";
import { PasswordInput } from "@/components/form/password-input";

const copy = dashboardNavLabels.accountPage;

export function AccountChangePasswordForm() {
  const [state, formAction] = useActionState(
    changePasswordAction,
    ACCOUNT_PASSWORD_FORM_INITIAL_STATE,
  );

  return (
    <Card className="gap-0">
      <form action={formAction} noValidate>
        <CardHeader className="border-b">
          <CardTitle>{copy.securityTitle}</CardTitle>
          <CardDescription>{copy.securityDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 py-5">
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
        </CardContent>
        <CardFooter className="justify-end border-t bg-muted/20">
          <FormSubmitButton
            idleText="Update password"
            loadingText="Updating…"
            className="w-auto min-w-32"
          />
        </CardFooter>
      </form>
    </Card>
  );
}
