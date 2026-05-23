import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import type { MembershipRole } from "@/generated/prisma/enums";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import { requireAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

const ORG_MANAGER_ROLES = new Set<MembershipRole>(["OWNER", "ADMIN"]);

const dashboardSuperAdminIds = (() => {
  const raw = process.env.DASHBOARD_SUPER_ADMIN_IDS;

  if (!raw) {
    return new Set<string>();
  }

  return new Set(
    raw

      .split(",")

      .map((id) => id.trim())

      .filter(Boolean),
  );
})();

export function isDashboardSuperAdmin(userId: string) {
  return dashboardSuperAdminIds.has(userId);
}

export function isOrganizationManagerRole(
  role: MembershipRole | null | undefined,
) {
  return role != null && ORG_MANAGER_ROLES.has(role);
}

async function findMemberRole(userId: string, organizationId: string) {
  const membership = await prisma.member.findFirst({
    where: { userId, organizationId },

    select: { role: true },
  });

  return membership?.role ?? null;
}

export async function getUserOrganizationRole(input: {
  userId: string;

  organizationId: string;
}) {
  return findMemberRole(input.userId, input.organizationId);
}

/** Policy helpers for actions, breadcrumbs, and sidebar — not for page guards. */

export async function canAccessUserProfile(input: {
  viewerUserId: string;

  targetUserId: string;
}) {
  return (
    input.viewerUserId === input.targetUserId ||
    isDashboardSuperAdmin(input.viewerUserId)
  );
}

export async function canAccessOrganization(input: {
  viewerUserId: string;

  organizationId: string;
}) {
  if (isDashboardSuperAdmin(input.viewerUserId)) {
    return true;
  }

  return (
    (await findMemberRole(input.viewerUserId, input.organizationId)) != null
  );
}

export async function canManageOrganization(input: {
  viewerUserId: string;

  organizationId: string;
}) {
  if (isDashboardSuperAdmin(input.viewerUserId)) {
    return true;
  }

  const role = await findMemberRole(
    input.viewerUserId,

    input.organizationId,
  );

  return isOrganizationManagerRole(role);
}

/**

 * Ensures the route user exists. Call from a future `users/[userId]/layout.tsx` only.

 */

export const assertDashboardUserExists = cache(async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },

    select: { id: true },
  });

  if (!user) {
    notFound();
  }
});

/** Layout only: future admin `users/[userId]/layout.tsx` */

export const requireUserProfileAccess = cache(async (targetUserId: string) => {
  const session = await requireAuthSession();

  if (
    !(await canAccessUserProfile({
      viewerUserId: session.user.id,

      targetUserId,
    }))
  ) {
    redirect(dashboardRoutes.home());
  }
});

/**

 * Viewer may view this organization (member or dashboard super-admin).

 * **Layout only:** `src/app/dashboard/organizations/[organizationId]/layout.tsx`.

 */

export const requireOrganizationAccess = cache(
  async (organizationId: string) => {
    const session = await requireAuthSession();

    if (
      !(await canAccessOrganization({
        viewerUserId: session.user.id,

        organizationId,
      }))
    ) {
      redirect(dashboardRoutes.home());
    }
  },
);

/**

 * Viewer may manage members/teams/invitations for this organization.

 * **Layout only:** `organizations/[organizationId]/manage/layout.tsx`.

 * Parent org layout must already call {@link requireOrganizationAccess}.

 */

export const requireOrganizationManageAccess = cache(
  async (organizationId: string) => {
    if (!organizationId) {
      notFound();
    }

    const session = await requireAuthSession();

    if (
      !(await canManageOrganization({
        viewerUserId: session.user.id,

        organizationId,
      }))
    ) {
      redirect(dashboardRoutes.organizationRoot(organizationId));
    }
  },
);
