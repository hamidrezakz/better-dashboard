import { cacheLife, cacheTag } from "next/cache";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import { prisma } from "@/lib/prisma";

export async function getAccountProfile(userId: string) {
  "use cache";

  cacheLife("minutes");
  cacheTag(dashboardCacheTags.userProfileById(userId));

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  if (!user) {
    return null;
  }

  return user;
}
