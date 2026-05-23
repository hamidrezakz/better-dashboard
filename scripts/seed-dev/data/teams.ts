import type { Prisma } from "@/generated/prisma/client";
import { ORGANIZATIONS, TEAMS_PER_ORG, teamId } from "../config";

const TEAM_NAMES = ["تیم محصول", "تیم فنی", "تیم پشتیبانی"];

export function buildSeedTeams(): Prisma.TeamCreateManyInput[] {
  const rows: Prisma.TeamCreateManyInput[] = [];
  const base = new Date("2025-03-01T09:00:00Z");

  ORGANIZATIONS.forEach((org, orgIndex) => {
    for (let t = 0; t < TEAMS_PER_ORG; t++) {
      rows.push({
        id: teamId(orgIndex, t),
        name: TEAM_NAMES[t] ?? `تیم ${t + 1}`,
        organizationId: org.id,
        createdAt: new Date(
          base.getTime() + (orgIndex * TEAMS_PER_ORG + t) * 86_400_000,
        ),
        updatedAt: new Date(),
      });
    }
  });

  return rows;
}
