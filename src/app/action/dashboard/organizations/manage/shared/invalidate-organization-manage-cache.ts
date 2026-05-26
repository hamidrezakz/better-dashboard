import { updateTag } from "next/cache";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import { prisma } from "@/lib/prisma";

export function invalidateOrganizationMembersCache(organizationId: string) {
  updateTag(dashboardCacheTags.organizationMembersById(organizationId));
}

export function invalidateOrganizationTeamsCache(organizationId: string) {
  updateTag(dashboardCacheTags.organizationTeamsById(organizationId));
}

export function invalidateOrganizationSummaryCache(organizationId: string) {
  updateTag(dashboardCacheTags.organizationSummaryById(organizationId));
}

export function invalidateOrganizationTeamProfileCache(
  organizationId: string,
  teamId: string,
) {
  updateTag(
    dashboardCacheTags.organizationTeamProfileById(organizationId, teamId),
  );
}

export function invalidateUserProfileCache(userId: string) {
  updateTag(dashboardCacheTags.userProfileById(userId));
}

/** Invalidates members, teams, and org summary — use when a change affects multiple manage slices. */
export function invalidateOrganizationManageCache(organizationId: string) {
  invalidateOrganizationMembersCache(organizationId);
  invalidateOrganizationTeamsCache(organizationId);
  invalidateOrganizationSummaryCache(organizationId);
}

export async function invalidateOrganizationSidebarCaches(
  organizationId: string,
) {
  const members = await prisma.member.findMany({
    where: { organizationId },
    select: { userId: true },
  });

  for (const member of members) {
    updateTag(dashboardCacheTags.sidebarConfigByUser(member.userId));
  }
}
