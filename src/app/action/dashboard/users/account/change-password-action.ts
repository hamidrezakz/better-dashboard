"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { requireAuthSession } from "@/lib/auth/session";
import { getAccountActionErrorMessage } from "@/app/action/dashboard/users/account/shared/account-action-error-message";
import { type AccountPasswordFormState } from "@/app/action/dashboard/users/account/shared/account-form-state";

function getStringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

const MIN_PASSWORD_LENGTH = 8;

export async function changePasswordAction(
  _prevState: AccountPasswordFormState,
  formData: FormData,
): Promise<AccountPasswordFormState> {
  await requireAuthSession();

  const currentPassword = getStringValue(formData.get("currentPassword"));
  const newPassword = getStringValue(formData.get("newPassword"));
  const confirmPassword = getStringValue(formData.get("confirmPassword"));

  if (!currentPassword || !newPassword || !confirmPassword) {
    return {
      formError: "همه فیلدهای رمز عبور را پر کنید.",
      fieldErrors: {
        currentPassword: !currentPassword
          ? "رمز عبور فعلی الزامی است."
          : undefined,
        newPassword: !newPassword ? "رمز عبور جدید الزامی است." : undefined,
        confirmPassword: !confirmPassword
          ? "تکرار رمز عبور جدید الزامی است."
          : undefined,
      },
    };
  }

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return {
      formError: "رمز عبور جدید باید حداقل ۸ کاراکتر باشد.",
      fieldErrors: {
        newPassword: "رمز عبور جدید باید حداقل ۸ کاراکتر باشد.",
      },
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      formError: "رمزهای عبور جدید یکسان نیستند.",
      fieldErrors: {
        confirmPassword: "رمزهای عبور جدید یکسان نیستند.",
      },
    };
  }

  try {
    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword,
        newPassword,
        revokeOtherSessions: false,
      },
    });
  } catch (error) {
    return {
      formError: getAccountActionErrorMessage({
        error,
        fallback: "تغییر رمز عبور ممکن نشد. لطفاً دوباره امتحان کنید.",
      }),
    };
  }

  return { success: true };
}
