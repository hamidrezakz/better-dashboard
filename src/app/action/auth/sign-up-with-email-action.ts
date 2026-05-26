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

export async function signUpWithEmailAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const name = getStringValue(formData.get("name"));
  const email = getStringValue(formData.get("email"));
  const password = getStringValue(formData.get("password"));
  const redirectTo = normalizeAuthRedirectTarget(
    getStringValue(formData.get("redirectTo")),
  );

  if (!name || !email || !password) {
    return {
      formError: "Please complete all required fields.",
      fieldErrors: {
        name: !name ? "Full name is required." : undefined,
        email: !email ? "Email is required." : undefined,
        password: !password ? "Password is required." : undefined,
      },
      values: { name, email },
    };
  }

  if (!isValidEmail(email)) {
    return {
      formError: "Please enter a valid email address.",
      fieldErrors: {
        email: "Please enter a valid email address.",
      },
      values: { name, email },
    };
  }

  if (password.length < 8) {
    return {
      formError: "Password must be at least 8 characters.",
      fieldErrors: {
        password: "Password must be at least 8 characters.",
      },
      values: { name, email },
    };
  }

  try {
    await auth.api.signUpEmail({
      headers: await headers(),
      body: {
        name,
        email,
        password,
        callbackURL: redirectTo,
      },
    });
  } catch (error) {
    return {
      formError: getAuthActionErrorMessage({
        error,
        fallback:
          "We couldn't create your account right now. Please try again.",
      }),
      values: { name, email },
    };
  }

  redirect(redirectTo);
}
