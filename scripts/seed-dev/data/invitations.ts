import type { Prisma } from "@/generated/prisma/client";
import {
  INVITATION_COUNT,
  ORGANIZATIONS,
  OWNER_USER_ID,
  teamId,
} from "../config";

export function buildSeedInvitations(): Prisma.InvitationCreateManyInput[] {
  const rows: Prisma.InvitationCreateManyInput[] = [];
  const now = Date.now();

  for (let i = 0; i < INVITATION_COUNT; i++) {
    const orgIndex = i % 2;
    const org = ORGANIZATIONS[orgIndex];
    const teamOnly = i % 11 === 0;
    const withTeam = i % 3 === 0 && !teamOnly;

    const expiresAt = new Date(now + (7 + (i % 30)) * 86_400_000);
    const maxUses = i % 7 === 0 ? null : 10 + (i % 5);
    const exhausted = i % 4 === 0;

    rows.push({
      id: `seed_inv_${String(i).padStart(3, "0")}`,
      organizationId: teamOnly ? null : org.id,
      teamId: teamOnly || withTeam ? teamId(orgIndex, i % 3) : null,
      expiresAt,
      maxUses,
      usedCount: exhausted ? (maxUses ?? 5) : Math.min(i % 4, 3),
      inviterId: OWNER_USER_ID,
      createdAt: new Date(now - (INVITATION_COUNT - i) * 3_600_000),
    });
  }

  return rows;
}
