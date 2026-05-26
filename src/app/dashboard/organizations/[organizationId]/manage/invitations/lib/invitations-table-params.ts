import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import { INVITATIONS_DEFAULT_PAGE_SIZE } from "@/app/dashboard/organizations/[organizationId]/manage/invitations/lib/invitation-form-utils";
import {
  dataTablePath,
  type DataTableSearchParamsInput,
} from "@/lib/data-table/search-params";

export function organizationInvitationsTablePath(
  organizationId: string,
  input: Pick<DataTableSearchParamsInput, "page" | "pageSize"> = {},
): string {
  return dataTablePath(
    dashboardRoutes.organizationInvitations(organizationId),
    { page: input.page, pageSize: input.pageSize },
    { defaultPageSize: INVITATIONS_DEFAULT_PAGE_SIZE },
  );
}
