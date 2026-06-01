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
      formError: "ایمیل و رمز عبور را وارد کنید.",
      fieldErrors: {
        email: !email ? "ایمیل الزامی است." : undefined,
        password: !password ? "رمز عبور الزامی است." : undefined,
      },
      values: { email },
    };
  }

  if (!isValidEmail(email)) {
    return {
      formError: "یک آدرس ایمیل معتبر وارد کنید.",
      fieldErrors: {
        email: "یک آدرس ایمیل معتبر وارد کنید.",
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
        fallback:
          "ورود ناموفق بود. اطلاعات را بررسی کنید و دوباره امتحان کنید.",
      }),
      values: { email },
    };
  }

  redirect(redirectTo);
}
