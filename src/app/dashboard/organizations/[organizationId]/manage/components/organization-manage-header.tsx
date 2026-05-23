import { notFound } from "next/navigation";
import { getOrganizationDisplayName } from "@/app/dashboard/organizations/[organizationId]/manage/lib/get-organization-display-name";

type OrganizationManageHeaderProps = {
  organizationId: string;
};

export async function OrganizationManageHeader({
  organizationId,
}: OrganizationManageHeaderProps) {
  const name = await getOrganizationDisplayName(organizationId);

  if (!name) {
    notFound();
  }

  return <h1 className="text-base font-semibold">{name}</h1>;
}
