import { cacheLife, cacheTag } from "next/cache";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import { prisma } from "@/lib/prisma";

export async function getOrganizationDisplayName(organizationId: string) {
  "use cache";

  cacheLife("minutes");
  cacheTag(dashboardCacheTags.organizationSummaryById(organizationId));

  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
    select: {
      name: true,
    },
  });

  return organization?.name ?? null;
}
