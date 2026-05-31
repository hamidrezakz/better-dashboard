import { cache } from "react";
import { UserRole } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

/** Platform admin (Better Auth admin plugin `user.role`, not org membership). */
export const isPlatformAdmin = cache(
  async (userId: string): Promise<boolean> => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    return user?.role === UserRole.admin;
  },
);
