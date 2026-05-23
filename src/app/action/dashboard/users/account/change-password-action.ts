"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { requireAuthSession } from "@/lib/auth-session";
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
      formError: "Please complete all password fields.",
      fieldErrors: {
        currentPassword: !currentPassword
          ? "Current password is required."
          : undefined,
        newPassword: !newPassword ? "New password is required." : undefined,
        confirmPassword: !confirmPassword
          ? "Please confirm your new password."
          : undefined,
      },
    };
  }

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return {
      formError: "New password must be at least 8 characters.",
      fieldErrors: {
        newPassword: "New password must be at least 8 characters.",
      },
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      formError: "New passwords do not match.",
      fieldErrors: {
        confirmPassword: "New passwords do not match.",
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
        fallback: "We couldn't change your password. Please try again.",
      }),
    };
  }

  return { success: true };
}
