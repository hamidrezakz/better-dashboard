"use client";

import { useActionState } from "react";
import { MailIcon, UserIcon } from "lucide-react";
import { signUpWithEmailAction } from "@/app/action/auth/sign-up-with-email-action";
import { AUTH_FORM_INITIAL_STATE } from "@/app/action/auth/shared/auth-form-state";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormSubmitButton } from "@/components/form/form-submit-button";
import { PasswordInput } from "@/components/form/password-input";

type SignUpFormProps = {
  redirectTo: string;
};

export function SignUpForm({ redirectTo }: SignUpFormProps) {
  const [state, formAction] = useActionState(
    signUpWithEmailAction,
    AUTH_FORM_INITIAL_STATE,
  );

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="redirectTo" value={redirectTo} />
      {state.formError ? (
        <Alert variant="destructive">
          <AlertDescription>{state.formError}</AlertDescription>
        </Alert>
      ) : null}
      <FieldGroup>
        <Field data-invalid={Boolean(state.fieldErrors?.name)}>
          <FieldLabel htmlFor="name">Full name</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="name"
              name="name"
              placeholder="e.g. Jane Doe"
              autoComplete="name"
              defaultValue={state.values?.name ?? ""}
              aria-invalid={Boolean(state.fieldErrors?.name)}
              required
            />
            <InputGroupAddon>
              <UserIcon
                className="size-3.5 shrink-0 opacity-60"
                aria-hidden="true"
              />
            </InputGroupAddon>
          </InputGroup>
          <FieldError errors={[{ message: state.fieldErrors?.name }]} />
        </Field>
        <Field data-invalid={Boolean(state.fieldErrors?.email)}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="email"
              name="email"
              type="email"
              placeholder="example@email.com"
              autoComplete="email"
              defaultValue={state.values?.email ?? ""}
              aria-invalid={Boolean(state.fieldErrors?.email)}
              required
            />
            <InputGroupAddon>
              <MailIcon
                className="size-3.5 shrink-0 opacity-60"
                aria-hidden="true"
              />
            </InputGroupAddon>
          </InputGroup>
          <FieldError errors={[{ message: state.fieldErrors?.email }]} />
        </Field>
        <Field data-invalid={Boolean(state.fieldErrors?.password)}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            minLength={8}
            aria-invalid={Boolean(state.fieldErrors?.password)}
            required
          />
          <FieldError errors={[{ message: state.fieldErrors?.password }]} />
        </Field>
      </FieldGroup>
      <FormSubmitButton
        idleText="Create account"
        loadingText="Creating account..."
      />
    </form>
  );
}
