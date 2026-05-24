import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import {
  buildDashboardTableSearchParams,
  type DashboardTableSearchParamsInput,
} from "@/lib/dashboard-table-search-params";

export const TEAM_MEMBERS_PAGE_SIZE = 10;

export function organizationTeamMembersTablePath(
  organizationId: string,
  teamId: string,
  input?: DashboardTableSearchParamsInput,
) {
  const base = dashboardRoutes.organizationTeamMembers(organizationId, teamId);

  if (!input) {
    return base;
  }

  const query = buildDashboardTableSearchParams(input);

  return query ? `${base}?${query}` : base;
}
