import { redirect } from "next/navigation";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";

type OrganizationTeamMembersRedirectProps = {
  params: Promise<{
    organizationId: string;
    teamId: string;
  }>;
};

export default async function OrganizationTeamMembersRedirectPage({
  params,
}: OrganizationTeamMembersRedirectProps) {
  const { organizationId, teamId } = await params;
  redirect(dashboardRoutes.organizationTeam(organizationId, teamId));
}
