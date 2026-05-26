import { notFound } from "next/navigation";
import { getOrganizationTeamInOrg } from "@/app/dashboard/organizations/[organizationId]/lib/get-organization-team-in-org";

type OrganizationTeamLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    organizationId: string;
    teamId: string;
  }>;
};

export default async function OrganizationTeamLayout({
  children,
  params,
}: OrganizationTeamLayoutProps) {
  const { organizationId, teamId } = await params;

  const team = await getOrganizationTeamInOrg({
    organizationId,
    teamId,
  });

  if (!team) {
    notFound();
  }

  return children;
}
