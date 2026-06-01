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
      error: "You don't have permission to change platform roles.",
    };
  }

  if (!ALLOWED_ROLES.includes(input.role)) {
    return { success: false, error: "Invalid platform role." };
  }

  const target = await prisma.user.findUnique({
    where: { id: input.userId },
    select: { id: true, role: true },
  });

  if (!target) {
    return { success: false, error: "User not found." };
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
      error: "You cannot remove your own platform admin role.",
    };
  }

  if (target.role === UserRole.admin && input.role === UserRole.user) {
    const adminCount = await prisma.user.count({
      where: { role: UserRole.admin },
    });

    if (adminCount <= 1) {
      return {
        success: false,
        error: "At least one platform admin must remain.",
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
      error: "Could not update the user's platform role.",
    };
  }

  invalidateAdminUsersPageCache();
  invalidateAdminUserSideEffects(input.userId);

  return { success: true };
}
