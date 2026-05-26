import { requireOrganizationTeamViewAccess } from "@/app/dashboard/lib/dashboard-access";

type OrganizationTeamViewLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    organizationId: string;
    teamId: string;
  }>;
};

export default async function OrganizationTeamViewLayout({
  children,
  params,
}: OrganizationTeamViewLayoutProps) {
  const { organizationId, teamId } = await params;
  await requireOrganizationTeamViewAccess(organizationId, teamId);
  return children;
}
