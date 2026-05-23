import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { type DashboardSidebarConfig } from "@/app/dashboard/lib/sidebar-types";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import { getDashboardSidebarItems } from "@/app/dashboard/lib/dashboard-items";

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
    where: {
      userId: input.userId,
    },
    include: {
      organization: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const organizations = memberships.map((membership) => ({
    id: membership.organization.id,
    name: membership.organization.name,
    slug: membership.organization.slug,
  }));

  const activeOrganizationId =
    input.activeOrganizationId ?? organizations[0]?.id ?? null;

  const activeOrganizationMembership = memberships.find(
    (membership) => membership.organizationId === activeOrganizationId,
  );

  const sidebarItems = getDashboardSidebarItems({
    userId: input.userId,
    activeOrganizationId,
    activeOrganizationRole: activeOrganizationMembership?.role ?? null,
  });

  return {
    user: {
      name: input.userName,
      email: input.userEmail,
      avatar: input.userAvatar ?? "",
    },
    organizations,
    activeOrganizationId,
    navMain: sidebarItems.navMain,
    projects: sidebarItems.projects,
  };
}
