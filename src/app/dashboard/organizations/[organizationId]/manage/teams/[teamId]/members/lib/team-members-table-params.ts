import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import {
  buildDashboardTableSearchParams,
  type DashboardTableSearchParamsInput,
} from "@/lib/dashboard-table-search-params";

export const TEAM_MEMBERS_DEFAULT_PAGE_SIZE = 10;

export type OrganizationTeamMembersPageQuery = {
  page: number;
  pageSize: number;
};

export function organizationTeamMembersTablePath(
  organizationId: string,
  teamId: string,
  input?: DashboardTableSearchParamsInput,
) {
  const base = dashboardRoutes.organizationTeam(organizationId, teamId);

  if (!input) {
    return base;
  }

  const query = buildDashboardTableSearchParams(input, {
    defaultPageSize: TEAM_MEMBERS_DEFAULT_PAGE_SIZE,
  });

  return query ? `${base}${query}` : base;
}
