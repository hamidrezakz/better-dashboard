import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import {
  dataTablePath,
  type DataTableSearchParamsInput,
} from "@/lib/data-table/search-params";

export const MEMBERS_DEFAULT_PAGE_SIZE = 20;

export type MemberTableFilter = "all" | "managers" | "members";

const memberTableFilters = new Set<MemberTableFilter>([
  "all",
  "managers",
  "members",
]);

export function parseMemberTableFilter(
  value: string | undefined,
): MemberTableFilter {
  if (value && memberTableFilters.has(value as MemberTableFilter)) {
    return value as MemberTableFilter;
  }
  return "all";
}

export const memberFilterLabels: Record<MemberTableFilter, string> = {
  all: "All",
  managers: "Managers",
  members: "Members",
};

export function organizationMembersTablePath(
  organizationId: string,
  input: Pick<DataTableSearchParamsInput, "page" | "pageSize"> & {
    filter?: MemberTableFilter;
  } = {},
): string {
  const filter =
    input.filter && input.filter !== "all" ? input.filter : undefined;

  return dataTablePath(
    dashboardRoutes.organizationMembers(organizationId),
    {
      page: input.page,
      pageSize: input.pageSize,
      filter,
    },
    { defaultPageSize: MEMBERS_DEFAULT_PAGE_SIZE },
  );
}
