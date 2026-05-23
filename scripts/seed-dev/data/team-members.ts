import type { Prisma } from "@/generated/prisma/client";
import {
  ALPHA_FAKE_MEMBER_COUNT,
  FAKE_USER_COUNT,
  OWNER_USER_ID,
  TEAMS_PER_ORG,
  fakeUserId,
  teamId,
} from "../config";

/** Subset of fake users on teams (plus owner on first team of alpha). */
export function buildSeedTeamMembers(): Prisma.TeamMemberCreateManyInput[] {
  const rows: Prisma.TeamMemberCreateManyInput[] = [];
  const base = new Date("2025-03-15T10:00:00Z");

  rows.push({
    id: "seed_tm_owner_alpha_t0",
    teamId: teamId(0, 0),
    userId: OWNER_USER_ID,
    createdAt: base,
  });

  for (let i = 0; i < FAKE_USER_COUNT; i++) {
    if (i % 3 !== 0) {
      continue;
    }

    const orgIndex = i < ALPHA_FAKE_MEMBER_COUNT ? 0 : 1;
    const teamIndex = i % TEAMS_PER_ORG;

    rows.push({
      id: `seed_tm_${String(i).padStart(3, "0")}`,
      teamId: teamId(orgIndex, teamIndex),
      userId: fakeUserId(i),
      createdAt: new Date(base.getTime() + i * 1_800_000),
    });
  }

  return rows;
}
