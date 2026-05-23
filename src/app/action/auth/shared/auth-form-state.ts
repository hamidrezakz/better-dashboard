export type AuthFormFieldName = "name" | "email" | "password";

export type AuthFormState = {
  formError?: string;
  fieldErrors?: Partial<Record<AuthFormFieldName, string>>;
  values?: {
    name?: string;
    email?: string;
  };
};

export const AUTH_FORM_INITIAL_STATE: AuthFormState = {};
