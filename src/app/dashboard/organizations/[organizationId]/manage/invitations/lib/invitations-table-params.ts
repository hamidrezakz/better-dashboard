import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import { INVITATIONS_DEFAULT_PAGE_SIZE } from "@/app/dashboard/organizations/[organizationId]/manage/invitations/lib/invitation-form-utils";
import {
  dashboardTablePath,
  type DashboardTableSearchParamsInput,
} from "@/lib/dashboard-table-search-params";

export function organizationInvitationsTablePath(
  organizationId: string,
  input: Pick<DashboardTableSearchParamsInput, "page" | "pageSize"> = {},
): string {
  return dashboardTablePath(
    dashboardRoutes.organizationInvitations(organizationId),
    { page: input.page, pageSize: input.pageSize },
    { defaultPageSize: INVITATIONS_DEFAULT_PAGE_SIZE },
  );
}
