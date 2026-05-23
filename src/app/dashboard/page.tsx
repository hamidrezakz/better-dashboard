import { redirect } from "next/navigation";
import { getActiveOrganizationLandingPath } from "@/app/dashboard/lib/dashboard-items";
import { getUserOrganizationRole } from "@/app/dashboard/lib/dashboard-access";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import { requireAuthSession } from "@/lib/auth-session";

export default async function DashboardPage() {
  const session = await requireAuthSession();

  const activeOrganizationId = session.session.activeOrganizationId ?? null;
  const activeOrganizationRole = activeOrganizationId
    ? await getUserOrganizationRole({
        userId: session.user.id,
        organizationId: activeOrganizationId,
      })
    : null;

  redirect(
    getActiveOrganizationLandingPath({
      organizationId: activeOrganizationId,
      role: activeOrganizationRole,
      userId: session.user.id,
    }),
  );
}
