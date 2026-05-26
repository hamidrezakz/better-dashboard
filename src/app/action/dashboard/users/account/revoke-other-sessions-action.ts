"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { requireAuthSession } from "@/lib/auth/session";
import { getAccountActionErrorMessage } from "@/app/action/dashboard/users/account/shared/account-action-error-message";

type RevokeOtherSessionsResult = {
  success: boolean;
  error?: string;
};

export async function revokeOtherSessionsAction(): Promise<RevokeOtherSessionsResult> {
  await requireAuthSession();

  try {
    await auth.api.revokeOtherSessions({
      headers: await headers(),
    });
  } catch (error) {
    return {
      success: false,
      error: getAccountActionErrorMessage({
        error,
        fallback: "We couldn't sign out your other sessions. Please try again.",
      }),
    };
  }

  return { success: true };
}
