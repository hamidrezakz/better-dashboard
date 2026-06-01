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
      error: "مجوز مسدود کردن کاربران را ندارید.",
    };
  }

  if (input.userId === actorUserId) {
    return { success: false, error: "نمی‌توانید حساب خودتان را مسدود کنید." };
  }

  try {
    await auth.api.banUser({
      headers: await headers(),
      body: {
        userId: input.userId,
      },
    });
  } catch {
    return { success: false, error: "مسدود کردن کاربر ممکن نشد." };
  }

  invalidateAdminUsersPageCache();
  invalidateAdminUserSideEffects(input.userId);

  return { success: true };
}
