import { cacheLife, cacheTag } from "next/cache";
import { getDashboardSidebarItems } from "@/app/dashboard/lib/sidebar/dashboard-items";
import { type DashboardSidebarConfig } from "@/app/dashboard/lib/sidebar/sidebar-types";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import { prisma } from "@/lib/prisma";

type DashboardSidebarConfigInput = {
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string | null;
  activeOrganizationId: string | null;
};

export async function getDashboardSidebarConfig(
  input: DashboardSidebarConfigInput,
): Promise<DashboardSidebarConfig> {
  "use cache";

  cacheLife("minutes");
  cacheTag(dashboardCacheTags.sidebarConfigByUser(input.userId));

  const memberships = await prisma.member.findMany({
    where: { userId: input.userId },
    include: { organization: true },
    orderBy: { createdAt: "asc" },
  });

  const organizations = memberships.map((membership) => ({
    id: membership.organization.id,
    name: membership.organization.name,
    slug: membership.organization.slug,
  }));

  const activeOrganizationId =
    input.activeOrganizationId ?? organizations[0]?.id ?? null;

  const activeMembership = memberships.find(
    (membership) => membership.organizationId === activeOrganizationId,
  );

  const { navGroups, projects } = getDashboardSidebarItems({
    userId: input.userId,
    activeOrganizationId,
    activeOrganizationRole: activeMembership?.role ?? null,
  });

  return {
    user: {
      name: input.userName,
      email: input.userEmail,
      avatar: input.userAvatar ?? "",
    },
    organizations,
    activeOrganizationId,
    navGroups,
    projects,
  };
}
