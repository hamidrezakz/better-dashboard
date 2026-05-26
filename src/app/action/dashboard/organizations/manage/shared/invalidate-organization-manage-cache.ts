import { updateTag } from "next/cache";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";

export function invalidateOrganizationManageCache(organizationId: string) {
  updateTag(dashboardCacheTags.organizationMembersById(organizationId));
  updateTag(dashboardCacheTags.organizationTeamsById(organizationId));
  updateTag(dashboardCacheTags.organizationSummaryById(organizationId));
}
