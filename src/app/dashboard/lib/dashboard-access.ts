import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import type { MembershipRole } from "@/generated/prisma/enums";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import { isPlatformAdmin } from "@/lib/auth/user-role";
import { requireAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const ORG_MANAGER_ROLES = new Set<MembershipRole>(["OWNER", "ADMIN"]);

export function isOrganizationManagerRole(
  role: MembershipRole | null | undefined,
) {
  return role != null && ORG_MANAGER_ROLES.has(role);
}

export async function getUserOrganizationRole(input: {
  userId: string;
  organizationId: string;
}) {
  const membership = await prisma.member.findFirst({
    where: { userId: input.userId, organizationId: input.organizationId },
    select: { role: true },
  });

  return membership?.role ?? null;
}

/** Policy helpers for actions, breadcrumbs, and sidebar — not for page guards. */

export async function canAccessOrganization(input: {
  viewerUserId: string;
  organizationId: string;
}) {
  if (await isPlatformAdmin(input.viewerUserId)) {
    return true;
  }

  return (
    (await getUserOrganizationRole({
      userId: input.viewerUserId,
      organizationId: input.organizationId,
    })) != null
  );
}

export async function canManageOrganization(input: {
  viewerUserId: string;
  organizationId: string;
}) {
  if (await isPlatformAdmin(input.viewerUserId)) {
    return true;
  }

  const role = await getUserOrganizationRole({
    userId: input.viewerUserId,
    organizationId: input.organizationId,
  });

  return isOrganizationManagerRole(role);
}

async function isOrganizationTeamMember(input: {
  userId: string;
  organizationId: string;
  teamId: string;
}) {
  const membership = await prisma.teamMember.findFirst({
    where: {
      userId: input.userId,
      teamId: input.teamId,
      team: {
        organizationId: input.organizationId,
      },
    },
    select: { id: true },
  });

  return membership != null;
}

export async function canAccessOrganizationTeamView(input: {
  viewerUserId: string;
  organizationId: string;
  teamId: string;
}) {
  if (await isPlatformAdmin(input.viewerUserId)) {
    return true;
  }

  if (
    await canAccessOrganization({
      viewerUserId: input.viewerUserId,
      organizationId: input.organizationId,
    })
  ) {
    return true;
  }

  return isOrganizationTeamMember({
    userId: input.viewerUserId,
    organizationId: input.organizationId,
    teamId: input.teamId,
  });
}

/**
 * Viewer may view this organization (member or platform admin).
 * **Page/layout:** org profile page and `manage/layout.tsx`.
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
 * Call {@link requireOrganizationAccess} before this in `manage/layout.tsx`.
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

/**
 * Viewer may view a team profile (team member, org member, or platform admin).
 * **Layout only:** `organizations/[organizationId]/teams/[teamId]/layout.tsx`.
 */
/**
 * Viewer is a platform admin (Better Auth `user.role`).
 * **Layout only:** `dashboard/admin/layout.tsx`.
 */
export const requirePlatformAdmin = cache(async () => {
  const session = await requireAuthSession();

  if (!(await isPlatformAdmin(session.user.id))) {
    redirect(dashboardRoutes.home());
  }

  return session;
});

export const requireOrganizationTeamViewAccess = cache(
  async (organizationId: string, teamId: string) => {
    if (!organizationId || !teamId) {
      notFound();
    }

    const session = await requireAuthSession();

    if (
      !(await canAccessOrganizationTeamView({
        viewerUserId: session.user.id,
        organizationId,
        teamId,
      }))
    ) {
      redirect(dashboardRoutes.home());
    }
  },
);
