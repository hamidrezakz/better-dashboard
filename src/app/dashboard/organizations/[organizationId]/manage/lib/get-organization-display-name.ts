import { getOrganizationBranding } from "@/app/dashboard/organizations/[organizationId]/manage/lib/get-organization-branding";

export async function getOrganizationDisplayName(organizationId: string) {
  const organization = await getOrganizationBranding(organizationId);

  return organization?.name ?? null;
}
