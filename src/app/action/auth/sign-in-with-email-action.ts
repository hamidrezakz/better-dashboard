"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { normalizeAuthRedirectTarget } from "@/lib/auth/redirect";
import { getAuthActionErrorMessage } from "@/app/action/auth/shared/auth-action-error-message";
import { type AuthFormState } from "@/app/action/auth/shared/auth-form-state";

function getStringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function signInWithEmailAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = getStringValue(formData.get("email"));
  const password = getStringValue(formData.get("password"));
  const redirectTo = normalizeAuthRedirectTarget(
    getStringValue(formData.get("redirectTo")),
  );

  if (!email || !password) {
    return {
      formError: "Please enter your email and password.",
      fieldErrors: {
        email: !email ? "Email is required." : undefined,
        password: !password ? "Password is required." : undefined,
      },
      values: { email },
    };
  }

  if (!isValidEmail(email)) {
    return {
      formError: "Please enter a valid email address.",
      fieldErrors: {
        email: "Please enter a valid email address.",
      },
      values: { email },
    };
  }

  try {
    await auth.api.signInEmail({
      headers: await headers(),
      body: {
        email,
        password,
        callbackURL: redirectTo,
        rememberMe: true,
      },
    });
  } catch (error) {
    return {
      formError: getAuthActionErrorMessage({
        error,
        fallback: "Sign-in failed. Check your credentials and try again.",
      }),
      values: { email },
    };
  }

  redirect(redirectTo);
}
