import { updateTag } from "next/cache";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";

export function invalidateUserDashboardCache(userId: string) {
  updateTag(dashboardCacheTags.userProfileById(userId));
  updateTag(dashboardCacheTags.sidebarConfigByUser(userId));
}
