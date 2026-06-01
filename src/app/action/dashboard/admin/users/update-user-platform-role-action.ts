"use server";

import { headers } from "next/headers";
import {
  invalidateAdminUserSideEffects,
  invalidateAdminUsersPageCache,
} from "@/app/action/dashboard/admin/shared/invalidate-admin-cache";
import { UserRole } from "@/generated/prisma/enums";
import { auth } from "@/lib/auth/auth";
import { requireAuthSession } from "@/lib/auth/session";
import { isPlatformAdmin } from "@/lib/auth/user-role";
import { prisma } from "@/lib/prisma";

type UpdateUserPlatformRoleInput = {
  userId: string;
  role: UserRole;
};

type UpdateUserPlatformRoleResult = {
  success: boolean;
  error?: string;
};

const ALLOWED_ROLES: UserRole[] = [UserRole.user, UserRole.admin];

export async function updateUserPlatformRoleAction(
  input: UpdateUserPlatformRoleInput,
): Promise<UpdateUserPlatformRoleResult> {
  const session = await requireAuthSession();
  const actorUserId = session.user.id;

  if (!(await isPlatformAdmin(actorUserId))) {
    return {
      success: false,
      error: "مجوز تغییر نقش پلتفرم را ندارید.",
    };
  }

  if (!ALLOWED_ROLES.includes(input.role)) {
    return { success: false, error: "نقش پلتفرم معتبر نیست." };
  }

  const target = await prisma.user.findUnique({
    where: { id: input.userId },
    select: { id: true, role: true },
  });

  if (!target) {
    return { success: false, error: "کاربر یافت نشد." };
  }

  if (target.role === input.role) {
    return { success: true };
  }

  if (
    target.id === actorUserId &&
    target.role === UserRole.admin &&
    input.role === UserRole.user
  ) {
    return {
      success: false,
      error: "نمی‌توانید نقش مدیر پلتفرم خودتان را حذف کنید.",
    };
  }

  if (target.role === UserRole.admin && input.role === UserRole.user) {
    const adminCount = await prisma.user.count({
      where: { role: UserRole.admin },
    });

    if (adminCount <= 1) {
      return {
        success: false,
        error: "حداقل یک مدیر پلتفرم باید باقی بماند.",
      };
    }
  }

  try {
    await auth.api.setRole({
      headers: await headers(),
      body: {
        userId: input.userId,
        role: input.role,
      },
    });
  } catch {
    return {
      success: false,
      error: "به‌روزرسانی نقش پلتفرم کاربر ممکن نشد.",
    };
  }

  invalidateAdminUsersPageCache();
  invalidateAdminUserSideEffects(input.userId);

  return { success: true };
}
