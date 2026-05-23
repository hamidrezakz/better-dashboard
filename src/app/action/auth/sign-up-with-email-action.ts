"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { normalizeAuthRedirectTarget } from "@/lib/auth-redirect";
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
      formError: "لطفا همه فیلدهای الزامی را تکمیل کنید.",
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
      formError: "لطفا یک ایمیل معتبر وارد کنید.",
      fieldErrors: {
        email: "لطفا یک ایمیل معتبر وارد کنید.",
      },
      values: { name, email },
    };
  }

  if (password.length < 8) {
    return {
      formError: "رمز عبور باید حداقل 8 کاراکتر باشد.",
      fieldErrors: {
        password: "رمز عبور باید حداقل 8 کاراکتر باشد.",
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
          "ایجاد حساب کاربری در حال حاضر ممکن نیست. لطفا دوباره تلاش کنید.",
      }),
      values: { name, email },
    };
  }

  redirect(redirectTo);
}
