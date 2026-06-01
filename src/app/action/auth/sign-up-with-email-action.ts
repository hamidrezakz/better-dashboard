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
      formError: "همه فیلدهای الزامی را پر کنید.",
      fieldErrors: {
        name: !name ? "نام کامل الزامی است." : undefined,
        email: !email ? "ایمیل الزامی است." : undefined,
        password: !password ? "رمز عبور الزامی است." : undefined,
      },
      values: { name, email },
    };
  }

  if (!isValidEmail(email)) {
    return {
      formError: "یک آدرس ایمیل معتبر وارد کنید.",
      fieldErrors: {
        email: "یک آدرس ایمیل معتبر وارد کنید.",
      },
      values: { name, email },
    };
  }

  if (password.length < 8) {
    return {
      formError: "رمز عبور باید حداقل ۸ کاراکتر باشد.",
      fieldErrors: {
        password: "رمز عبور باید حداقل ۸ کاراکتر باشد.",
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
          "اکنون نتوانستیم حساب شما را بسازیم. لطفاً دوباره امتحان کنید.",
      }),
      values: { name, email },
    };
  }

  redirect(redirectTo);
}
