"use server";

import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { requireAuthSession } from "@/lib/auth-session";
import { auth } from "@/lib/auth";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import { getUserOrganizationRole } from "@/app/dashboard/lib/dashboard-access";
import { getActiveOrganizationLandingPath } from "@/app/dashboard/lib/dashboard-items";

type SetActiveOrganizationInput = {
  organizationId: string;
};

type SetActiveOrganizationResult = {
  redirectTo: string;
};

export async function setActiveOrganizationAction({
  organizationId,
}: SetActiveOrganizationInput): Promise<SetActiveOrganizationResult> {
  if (!organizationId) {
    return {
      redirectTo: dashboardRoutes.organizations(),
    };
  }

  const requestHeaders = await headers();
  const session = await requireAuthSession();
  const userId = session.user.id;
  const previousActiveOrganizationId = session.session.activeOrganizationId;

  if (previousActiveOrganizationId === organizationId) {
    const activeOrganizationRole = await getUserOrganizationRole({
      userId,
      organizationId,
    });

    return {
      redirectTo: getActiveOrganizationLandingPath({
        organizationId,
        role: activeOrganizationRole,
      }),
    };
  }

  await auth.api.setActiveOrganization({
    headers: requestHeaders,
    body: {
      organizationId,
    },
  });

  const activeOrganizationRole = await getUserOrganizationRole({
    userId,
    organizationId,
  });

  updateTag(dashboardCacheTags.sidebarConfigByUser(userId));

  return {
    redirectTo: getActiveOrganizationLandingPath({
      organizationId,
      role: activeOrganizationRole,
    }),
  };
}
