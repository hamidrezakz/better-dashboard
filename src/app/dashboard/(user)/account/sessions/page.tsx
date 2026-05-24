import { redirect } from "next/navigation";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";

export default function AccountSessionsPage() {
  redirect(dashboardRoutes.accountSection("sessions"));
}
