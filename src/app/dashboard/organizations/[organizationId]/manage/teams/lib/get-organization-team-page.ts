import { cacheLife, cacheTag } from "next/cache";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import { getOrganizationTeamInOrg } from "@/app/dashboard/organizations/[organizationId]/lib/get-organization-team-in-org";

export type OrganizationTeamPageResult = {
  id: string;
  name: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
};

async function loadOrganizationTeamPage(input: {
  organizationId: string;
  teamId: string;
}): Promise<OrganizationTeamPageResult | null> {
  const team = await getOrganizationTeamInOrg(input);

  if (!team) {
    return null;
  }

  return {
    id: team.id,
    name: team.name,
    memberCount: team._count.teammembers,
    createdAt: team.createdAt.toISOString(),
    updatedAt: (team.updatedAt ?? team.createdAt).toISOString(),
  };
}

export async function getOrganizationTeamPage(input: {
  organizationId: string;
  teamId: string;
}) {
  "use cache";

  cacheLife("minutes");
  cacheTag(dashboardCacheTags.organizationTeamsById(input.organizationId));

  return loadOrganizationTeamPage(input);
}
