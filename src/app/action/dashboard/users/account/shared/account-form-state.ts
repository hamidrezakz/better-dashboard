export type AccountProfileFieldName = "name" | "image";

export type AccountPasswordFieldName =
  | "currentPassword"
  | "newPassword"
  | "confirmPassword";

export type AccountProfileFormState = {
  success?: boolean;
  formError?: string;
  fieldErrors?: Partial<Record<AccountProfileFieldName, string>>;
  values?: {
    name?: string;
    image?: string;
  };
};

export type AccountPasswordFormState = {
  success?: boolean;
  formError?: string;
  fieldErrors?: Partial<Record<AccountPasswordFieldName, string>>;
};

export const ACCOUNT_PROFILE_FORM_INITIAL_STATE: AccountProfileFormState = {};

export const ACCOUNT_PASSWORD_FORM_INITIAL_STATE: AccountPasswordFormState = {};
