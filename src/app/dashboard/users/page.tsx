import { redirect } from "next/navigation";
import { requireAuthSession } from "@/lib/auth-session";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";

export default async function DashboardUsersIndexPage() {
  const session = await requireAuthSession();

  redirect(dashboardRoutes.userProfile(session.user.id));
}
