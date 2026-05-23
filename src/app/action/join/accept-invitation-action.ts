"use server";

import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { joinCacheTags } from "@/app/join/lib/cache-tags";
import { resolveInvitationJoinScope } from "@/app/join/lib/invitation-scope";
import { getActiveOrganizationLandingPath } from "@/app/dashboard/lib/dashboard-items";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import { joinRoutes } from "@/app/join/lib/join-routes";
import { requireAuthSession } from "@/lib/auth-session";
import { auth } from "@/lib/auth";
import {
  invitationIsConsumable,
  invitationIsExhausted,
  invitationIsExpired,
} from "@/lib/invitation-display-status";
import { prisma } from "@/lib/prisma";

type AcceptInvitationResult =
  | {
      success: true;
      redirectTo: string;
    }
  | {
      success: false;
      error: string;
    };

function getInvitationErrorMessage(invitation: {
  expiresAt: Date;
  maxUses: number | null;
  usedCount: number;
}) {
  const expiresAtIso = invitation.expiresAt.toISOString();

  if (invitationIsExpired(expiresAtIso)) {
    return "مهلت این دعوت‌نامه به پایان رسیده است.";
  }

  if (invitationIsExhausted(invitation.usedCount, invitation.maxUses)) {
    return "ظرفیت استفاده از این دعوت‌نامه تکمیل شده است.";
  }

  return "این دعوت‌نامه دیگر قابل استفاده نیست.";
}

export async function acceptInvitationAction(
  invitationId: string,
): Promise<AcceptInvitationResult> {
  const session = await requireAuthSession(
    joinRoutes.invitationWithAutoAccept(invitationId),
  );
  const userId = session.user.id;

  const requestHeaders = await headers();

  try {
    const invitation = await prisma.invitation.findUnique({
      where: {
        id: invitationId,
      },
      include: {
        team: {
          select: {
            id: true,
            organizationId: true,
          },
        },
      },
    });

    if (!invitation) {
      return {
        success: false,
        error: "دعوت‌نامه پیدا نشد.",
      };
    }

    const scope = resolveInvitationJoinScope({
      organizationId: invitation.organizationId,
      teamId: invitation.teamId,
    });

    if (scope === "unknown") {
      return {
        success: false,
        error: "این دعوت‌نامه معتبر نیست.",
      };
    }

    const consumableInput = {
      expiresAt: invitation.expiresAt.toISOString(),
      usedCount: invitation.usedCount,
      maxUses: invitation.maxUses,
    };

    if (!invitationIsConsumable(consumableInput)) {
      return {
        success: false,
        error: getInvitationErrorMessage(invitation),
      };
    }

    const organizationId =
      invitation.organizationId ?? invitation.team?.organizationId ?? null;

    let membershipChanged = false;

    if (invitation.organizationId) {
      const existingMember = await prisma.member.findFirst({
        where: {
          userId,
          organizationId: invitation.organizationId,
        },
        select: {
          id: true,
        },
      });

      if (!existingMember) {
        await prisma.member.create({
          data: {
            userId,
            organizationId: invitation.organizationId,
            createdAt: new Date(),
          },
        });
        membershipChanged = true;
      }
    }

    if (invitation.teamId) {
      const existingTeamMember = await prisma.teamMember.findFirst({
        where: {
          userId,
          teamId: invitation.teamId,
        },
        select: {
          id: true,
        },
      });

      if (!existingTeamMember) {
        await prisma.teamMember.create({
          data: {
            userId,
            teamId: invitation.teamId,
            createdAt: new Date(),
          },
        });
        membershipChanged = true;
      }
    }

    if (membershipChanged) {
      await prisma.invitation.update({
        where: {
          id: invitation.id,
        },
        data: {
          usedCount: invitation.usedCount + 1,
        },
      });
    }

    updateTag(joinCacheTags.invitationById(invitationId));

    if (!organizationId) {
      return {
        success: true,
        redirectTo: dashboardRoutes.home(),
      };
    }

    const membership = await prisma.member.findFirst({
      where: {
        userId,
        organizationId,
      },
      select: {
        role: true,
      },
    });

    if (membership) {
      await auth.api.setActiveOrganization({
        headers: requestHeaders,
        body: {
          organizationId,
        },
      });

      updateTag(dashboardCacheTags.sidebarConfigByUser(userId));
    }

    updateTag(dashboardCacheTags.organizationSummaryById(organizationId));
    updateTag(dashboardCacheTags.organizationMembersById(organizationId));

    if (membershipChanged && invitation.teamId) {
      updateTag(dashboardCacheTags.organizationTeamsById(organizationId));
    }

    updateTag(dashboardCacheTags.organizationInvitationsById(organizationId));

    return {
      success: true,
      redirectTo: membership
        ? getActiveOrganizationLandingPath({
            organizationId,
            role: membership.role,
          })
        : dashboardRoutes.home(),
    };
  } catch {
    return {
      success: false,
      error: "پذیرش دعوت‌نامه ناموفق بود. دوباره تلاش کنید.",
    };
  }
}
