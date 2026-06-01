"use client";

import * as React from "react";
import type { AccountProfileFormState } from "@/app/action/dashboard/users/account/shared/account-form-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getUserInitials } from "@/lib/user-profile/user-display";

type AccountProfileFormFieldsProps = {
  formId: string;
  profile: {
    name: string;
    email: string;
    image: string | null;
  };
  state: AccountProfileFormState;
};

export function AccountProfileFormFields({
  formId,
  profile,
  state,
}: AccountProfileFormFieldsProps) {
  const values = resolveProfileValues(state, profile);
  const [photoUrl, setPhotoUrl] = React.useState(values.image);
  React.useEffect(() => {
    setPhotoUrl(values.image);
  }, [values.image]);
  const previewImage = photoUrl.trim() || profile.image || "";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="size-14">
          <AvatarImage src={previewImage} alt={values.name} />
          <AvatarFallback className="text-sm">
            {getUserInitials(values.name)}
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
          <FieldLabel htmlFor={`${formId}-email`}>ایمیل</FieldLabel>
          <Input
            id={`${formId}-email`}
            type="email"
            value={profile.email}
            disabled
            readOnly
          />
          <FieldDescription>ایمیل از داشبورد قابل تغییر نیست.</FieldDescription>
        </Field>
        <Field data-invalid={Boolean(state.fieldErrors?.name)}>
          <FieldLabel htmlFor={`${formId}-name`}>نام نمایشی</FieldLabel>
          <Input
            id={`${formId}-name`}
            name="name"
            autoComplete="name"
            defaultValue={values.name}
            aria-invalid={Boolean(state.fieldErrors?.name)}
            required
          />
          <FieldError errors={[{ message: state.fieldErrors?.name }]} />
        </Field>
        <Field data-invalid={Boolean(state.fieldErrors?.image)}>
          <FieldLabel htmlFor={`${formId}-image`}>آدرس تصویر</FieldLabel>
          <Input
            id={`${formId}-image`}
            name="image"
            type="url"
            placeholder="https://"
            value={photoUrl}
            onChange={(event) => setPhotoUrl(event.target.value)}
            aria-invalid={Boolean(state.fieldErrors?.image)}
          />
          <FieldDescription>
            اختیاری. برای حذف تصویر خالی بگذارید.
          </FieldDescription>
          <FieldError errors={[{ message: state.fieldErrors?.image }]} />
        </Field>
      </FieldGroup>
    </div>
  );
}

function resolveProfileValues(
  state: AccountProfileFormState,
  profile: AccountProfileFormFieldsProps["profile"],
) {
  return {
    name: state.values?.name ?? profile.name,
    image: state.values?.image ?? profile.image ?? "",
  };
}
