import { cacheLife, cacheTag } from "next/cache";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import type { OrganizationBranding } from "@/app/dashboard/organizations/[organizationId]/manage/lib/organization-form-utils";
import { prisma } from "@/lib/prisma";

export async function getOrganizationBranding(
  organizationId: string,
): Promise<OrganizationBranding | null> {
  "use cache";

  cacheLife("minutes");
  cacheTag(dashboardCacheTags.organizationSummaryById(organizationId));

  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
    select: {
      id: true,
      name: true,
      logo: true,
    },
  });

  if (!organization) {
    return null;
  }

  return organization;
}
