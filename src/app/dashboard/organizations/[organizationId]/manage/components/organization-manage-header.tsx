import { notFound } from "next/navigation";
import { OrganizationManageHeaderPanel } from "@/app/dashboard/organizations/[organizationId]/manage/components/organization-manage-header-panel";
import { getOrganizationBranding } from "@/app/dashboard/organizations/[organizationId]/manage/lib/get-organization-branding";

type OrganizationManageHeaderProps = {
  organizationId: string;
};

export async function OrganizationManageHeader({
  organizationId,
}: OrganizationManageHeaderProps) {
  const organization = await getOrganizationBranding(organizationId);

  if (!organization) {
    notFound();
  }

  return <OrganizationManageHeaderPanel organization={organization} />;
}
