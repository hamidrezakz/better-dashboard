"use client";

import { useActionState, useEffect, useState } from "react";
import { MailIcon } from "lucide-react";
import { signInWithEmailAction } from "@/app/action/auth/sign-in-with-email-action";
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

type LoginFormProps = {
  redirectTo: string;
};

export function LoginForm({ redirectTo }: LoginFormProps) {
  const [state, formAction] = useActionState(
    signInWithEmailAction,
    AUTH_FORM_INITIAL_STATE,
  );
  const [email, setEmail] = useState(state.values?.email ?? "");

  useEffect(() => {
    if (state.values?.email !== undefined) {
      setEmail(state.values.email);
    }
  }, [state.values?.email]);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="redirectTo" value={redirectTo} />
      {state.formError ? (
        <Alert variant="destructive">
          <AlertDescription>{state.formError}</AlertDescription>
        </Alert>
      ) : null}
      <FieldGroup>
        <Field data-invalid={Boolean(state.fieldErrors?.email)}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="email"
              name="email"
              type="email"
              placeholder="example@email.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
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
            autoComplete="current-password"
            aria-invalid={Boolean(state.fieldErrors?.password)}
            required
          />
          <FieldError errors={[{ message: state.fieldErrors?.password }]} />
        </Field>
      </FieldGroup>
      <FormSubmitButton idleText="Sign in" loadingText="Signing in..." />
    </form>
  );
}
