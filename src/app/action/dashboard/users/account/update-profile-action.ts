"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { requireAuthSession } from "@/lib/auth/session";
import { getAccountActionErrorMessage } from "@/app/action/dashboard/users/account/shared/account-action-error-message";
import { type AccountProfileFormState } from "@/app/action/dashboard/users/account/shared/account-form-state";
import { invalidateUserDashboardCache } from "@/app/action/dashboard/users/account/shared/invalidate-user-dashboard-cache";

function getStringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function updateProfileAction(
  _prevState: AccountProfileFormState,
  formData: FormData,
): Promise<AccountProfileFormState> {
  const session = await requireAuthSession();
  const name = getStringValue(formData.get("name"));
  const imageRaw = getStringValue(formData.get("image"));

  if (!name) {
    return {
      fieldErrors: { name: "نام الزامی است." },
      values: { name, image: imageRaw },
    };
  }

  const image = imageRaw.length > 0 ? imageRaw : null;

  try {
    await auth.api.updateUser({
      headers: await headers(),
      body: {
        name,
        image,
      },
    });
  } catch (error) {
    return {
      formError: getAccountActionErrorMessage({
        error,
        fallback: "پروفایل به‌روزرسانی نشد. لطفاً دوباره امتحان کنید.",
      }),
      values: { name, image: imageRaw },
    };
  }

  invalidateUserDashboardCache(session.user.id);

  return {
    success: true,
    values: { name, image: imageRaw },
  };
}
