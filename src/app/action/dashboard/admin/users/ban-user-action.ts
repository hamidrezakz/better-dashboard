"use server";

import { headers } from "next/headers";
import {
  invalidateAdminUserSideEffects,
  invalidateAdminUsersPageCache,
} from "@/app/action/dashboard/admin/shared/invalidate-admin-cache";
import { auth } from "@/lib/auth/auth";
import { requireAuthSession } from "@/lib/auth/session";
import { isPlatformAdmin } from "@/lib/auth/user-role";

type BanUserInput = {
  userId: string;
};

type BanUserResult = {
  success: boolean;
  error?: string;
};

export async function banUserAction(
  input: BanUserInput,
): Promise<BanUserResult> {
  const session = await requireAuthSession();
  const actorUserId = session.user.id;

  if (!(await isPlatformAdmin(actorUserId))) {
    return {
      success: false,
      error: "You don't have permission to ban users.",
    };
  }

  if (input.userId === actorUserId) {
    return { success: false, error: "You cannot ban your own account." };
  }

  try {
    await auth.api.banUser({
      headers: await headers(),
      body: {
        userId: input.userId,
      },
    });
  } catch {
    return { success: false, error: "Could not ban the user." };
  }

  invalidateAdminUsersPageCache();
  invalidateAdminUserSideEffects(input.userId);

  return { success: true };
}
