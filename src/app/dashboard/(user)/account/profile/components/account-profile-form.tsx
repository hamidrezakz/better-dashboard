"use client";

import * as React from "react";
import { useActionState } from "react";
import { updateProfileAction } from "@/app/action/dashboard/users/account/update-profile-action";
import {
  ACCOUNT_PROFILE_FORM_INITIAL_STATE,
  type AccountProfileFormState,
} from "@/app/action/dashboard/users/account/shared/account-form-state";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

const copy = dashboardNavLabels.accountPage;

export function AccountProfileForm({ profile }: AccountProfileFormProps) {
  const [state, formAction] = useActionState(
    updateProfileAction,
    ACCOUNT_PROFILE_FORM_INITIAL_STATE,
  );

  const values = resolveProfileValues(state, profile);
  const [photoUrl, setPhotoUrl] = React.useState(values.image);
  React.useEffect(() => {
    setPhotoUrl(values.image);
  }, [values.image]);
  const previewImage = photoUrl.trim() || profile.image || "";

  return (
    <Card className="gap-0">
      <form action={formAction} noValidate>
        <CardHeader className="border-b">
          <CardTitle>{copy.profileTitle}</CardTitle>
          <CardDescription>{copy.profileDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 py-5">
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

          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarImage src={previewImage} alt={values.name} />
              <AvatarFallback className="text-sm">
                {getInitials(values.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{values.name}</p>
              <p className="truncate text-sm text-muted-foreground">
                {profile.email}
              </p>
            </div>
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
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
              <FieldLabel htmlFor="name">Display name</FieldLabel>
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
              <FieldLabel htmlFor="image">Photo URL</FieldLabel>
              <Input
                id="image"
                name="image"
                type="url"
                placeholder="https://"
                value={photoUrl}
                onChange={(event) => setPhotoUrl(event.target.value)}
                aria-invalid={Boolean(state.fieldErrors?.image)}
              />
              <FieldDescription>
                Optional. Leave empty to remove your photo.
              </FieldDescription>
              <FieldError errors={[{ message: state.fieldErrors?.image }]} />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-end border-t bg-muted/20">
          <FormSubmitButton
            idleText="Save changes"
            loadingText="Saving…"
            className="w-auto min-w-28"
          />
        </CardFooter>
      </form>
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

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) {
    return "??";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}
