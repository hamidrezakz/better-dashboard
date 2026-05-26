"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { requireAuthSession } from "@/lib/auth/session";
import { getAccountActionErrorMessage } from "@/app/action/dashboard/users/account/shared/account-action-error-message";

type RevokeSessionInput = {
  token: string;
};

type RevokeSessionResult = {
  success: boolean;
  error?: string;
};

export async function revokeSessionAction(
  input: RevokeSessionInput,
): Promise<RevokeSessionResult> {
  await requireAuthSession();

  const token = input.token.trim();
  if (!token) {
    return { success: false, error: "Session token is required." };
  }

  try {
    await auth.api.revokeSession({
      headers: await headers(),
      body: { token },
    });
  } catch (error) {
    return {
      success: false,
      error: getAccountActionErrorMessage({
        error,
        fallback: "We couldn't sign out that session. Please try again.",
      }),
    };
  }

  return { success: true };
}
