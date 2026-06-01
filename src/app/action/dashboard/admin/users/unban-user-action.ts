"use server";

import { headers } from "next/headers";
import {
  invalidateAdminUserSideEffects,
  invalidateAdminUsersPageCache,
} from "@/app/action/dashboard/admin/shared/invalidate-admin-cache";
import { auth } from "@/lib/auth/auth";
import { requireAuthSession } from "@/lib/auth/session";
import { isPlatformAdmin } from "@/lib/auth/user-role";

type UnbanUserInput = {
  userId: string;
};

type UnbanUserResult = {
  success: boolean;
  error?: string;
};

export async function unbanUserAction(
  input: UnbanUserInput,
): Promise<UnbanUserResult> {
  const session = await requireAuthSession();
  const actorUserId = session.user.id;

  if (!(await isPlatformAdmin(actorUserId))) {
    return {
      success: false,
      error: "مجوز رفع مسدودیت کاربران را ندارید.",
    };
  }

  try {
    await auth.api.unbanUser({
      headers: await headers(),
      body: {
        userId: input.userId,
      },
    });
  } catch {
    return { success: false, error: "رفع مسدودیت کاربر ممکن نشد." };
  }

  invalidateAdminUsersPageCache();
  invalidateAdminUserSideEffects(input.userId);

  return { success: true };
}
