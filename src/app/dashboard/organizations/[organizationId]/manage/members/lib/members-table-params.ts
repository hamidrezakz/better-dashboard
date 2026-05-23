import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import {
  dashboardTablePath,
  type DashboardTableSearchParamsInput,
} from "@/lib/dashboard-table-search-params";

export const MEMBERS_PAGE_SIZE = 25;

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
  all: "همه",
  managers: "مدیران",
  members: "کاربران",
};

export function organizationMembersTablePath(
  organizationId: string,
  input: Pick<DashboardTableSearchParamsInput, "page"> & {
    filter?: MemberTableFilter;
  } = {},
): string {
  const filter =
    input.filter && input.filter !== "all" ? input.filter : undefined;

  return dashboardTablePath(
    dashboardRoutes.organizationMembers(organizationId),
    {
      page: input.page,
      filter,
    },
  );
}
