import { redirect } from "next/navigation";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";

type OrganizationManagePageProps = {
  params: Promise<{
    organizationId: string;
  }>;
};

export default async function OrganizationManagePage({
  params,
}: OrganizationManagePageProps) {
  const { organizationId } = await params;
  redirect(dashboardRoutes.organizationMembers(organizationId));
}
