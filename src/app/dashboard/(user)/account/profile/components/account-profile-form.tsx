"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/app/action/dashboard/users/account/update-profile-action";
import {
  ACCOUNT_PROFILE_FORM_INITIAL_STATE,
  type AccountProfileFormState,
} from "@/app/action/dashboard/users/account/shared/account-form-state";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FormSubmitButton } from "@/components/form/form-submit-button";

type AccountProfileFormProps = {
  profile: {
    name: string;
    email: string;
    image: string | null;
  };
};

export function AccountProfileForm({ profile }: AccountProfileFormProps) {
  const [state, formAction] = useActionState(
    updateProfileAction,
    ACCOUNT_PROFILE_FORM_INITIAL_STATE,
  );

  const values = resolveProfileValues(state, profile);

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4" noValidate>
          {state.success ? (
            <Alert>
              <AlertDescription>Your profile was updated.</AlertDescription>
            </Alert>
          ) : null}
          {state.formError ? (
            <Alert variant="destructive">
              <AlertDescription>{state.formError}</AlertDescription>
            </Alert>
          ) : null}
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                disabled
                readOnly
              />
              <FieldDescription>
                Email cannot be changed from the dashboard.
              </FieldDescription>
            </Field>
            <Field data-invalid={Boolean(state.fieldErrors?.name)}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                defaultValue={values.name}
                aria-invalid={Boolean(state.fieldErrors?.name)}
                required
              />
              <FieldError errors={[{ message: state.fieldErrors?.name }]} />
            </Field>
            <Field data-invalid={Boolean(state.fieldErrors?.image)}>
              <FieldLabel htmlFor="image">Profile image URL</FieldLabel>
              <Input
                id="image"
                name="image"
                type="url"
                placeholder="https://..."
                defaultValue={values.image}
                aria-invalid={Boolean(state.fieldErrors?.image)}
              />
              <FieldDescription>
                Optional. Leave empty to clear your profile image.
              </FieldDescription>
              <FieldError errors={[{ message: state.fieldErrors?.image }]} />
            </Field>
          </FieldGroup>
          <FormSubmitButton
            idleText="Save changes"
            loadingText="Saving..."
            className="w-auto"
          />
        </form>
      </CardContent>
    </Card>
  );
}

function resolveProfileValues(
  state: AccountProfileFormState,
  profile: AccountProfileFormProps["profile"],
) {
  return {
    name: state.values?.name ?? profile.name,
    image: state.values?.image ?? profile.image ?? "",
  };
}
