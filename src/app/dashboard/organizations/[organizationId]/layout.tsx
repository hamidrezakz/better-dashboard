import { requireOrganizationAccess } from "@/app/dashboard/lib/dashboard-access";

type OrganizationSegmentLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    organizationId: string;
  }>;
};

export default async function OrganizationSegmentLayout({
  children,
  params,
}: OrganizationSegmentLayoutProps) {
  const { organizationId } = await params;
  await requireOrganizationAccess(organizationId);
  return children;
}
