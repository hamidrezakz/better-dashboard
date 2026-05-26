import { cacheLife, cacheTag } from "next/cache";
import type { InvitationJoinScope } from "@/app/join/lib/invitation-scope";
import { resolveInvitationJoinScope } from "@/app/join/lib/invitation-scope";
import { joinCacheTags } from "@/app/join/lib/cache-tags";
import {
  invitationIsExhausted,
  invitationIsExpired,
} from "@/lib/badge/invitation-display-status";
import { prisma } from "@/lib/prisma";

export type InvitationJoinPreview =
  | {
      kind: "ok";
      invitationId: string;
      scope: InvitationJoinScope;
      expiresAt: string;
      maxUses: number | null;
      usedCount: number;
      organization: {
        id: string;
        name: string;
        logo: string | null;
      } | null;
      team: {
        id: string;
        name: string;
      } | null;
      isExpired: boolean;
      isExhausted: boolean;
      isUnavailable: boolean;
    }
  | {
      kind: "not_found";
    };

export async function getInvitationJoinPreview(
  invitationId: string,
): Promise<InvitationJoinPreview> {
  "use cache";

  cacheLife("minutes");
  cacheTag(joinCacheTags.invitationById(invitationId));

  const invitation = await prisma.invitation.findUnique({
    where: {
      id: invitationId,
    },
    select: {
      id: true,
      organizationId: true,
      teamId: true,
      expiresAt: true,
      maxUses: true,
      usedCount: true,
      organization: {
        select: {
          id: true,
          name: true,
          logo: true,
        },
      },
      team: {
        select: {
          id: true,
          name: true,
          organization: {
            select: {
              id: true,
              name: true,
              logo: true,
            },
          },
        },
      },
    },
  });

  if (!invitation) {
    return { kind: "not_found" };
  }

  const scope = resolveInvitationJoinScope({
    organizationId: invitation.organizationId,
    teamId: invitation.teamId,
  });

  const organization =
    invitation.organization ?? invitation.team?.organization ?? null;

  const now = Date.now();
  const expiresAtIso = invitation.expiresAt.toISOString();
  const isExpired = invitationIsExpired(expiresAtIso, now);
  const isExhausted = invitationIsExhausted(
    invitation.usedCount,
    invitation.maxUses,
  );
  const isUnavailable = isExpired || isExhausted;

  return {
    kind: "ok",
    invitationId: invitation.id,
    scope,
    expiresAt: expiresAtIso,
    maxUses: invitation.maxUses,
    usedCount: invitation.usedCount,
    organization: organization
      ? {
          id: organization.id,
          name: organization.name,
          logo: organization.logo,
        }
      : null,
    team: invitation.team
      ? {
          id: invitation.team.id,
          name: invitation.team.name,
        }
      : null,
    isExpired,
    isExhausted,
    isUnavailable,
  };
}
