import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import {
  buildDataTableSearchParams,
  type DataTableSearchParamsInput,
} from "@/lib/data-table/search-params";

export const TEAM_MEMBERS_DEFAULT_PAGE_SIZE = 10;

export type OrganizationTeamMembersPageQuery = {
  page: number;
  pageSize: number;
};

export function organizationTeamMembersTablePath(
  organizationId: string,
  teamId: string,
  input?: DataTableSearchParamsInput,
) {
  const base = dashboardRoutes.organizationTeam(organizationId, teamId);

  if (!input) {
    return base;
  }

  const query = buildDataTableSearchParams(input, {
    defaultPageSize: TEAM_MEMBERS_DEFAULT_PAGE_SIZE,
  });

  return query ? `${base}${query}` : base;
}
