import type { Prisma } from "@/generated/prisma/client";
import { MembershipRole } from "@/generated/prisma/enums";
import {
  ALPHA_FAKE_MEMBER_COUNT,
  FAKE_USER_COUNT,
  ORGANIZATIONS,
  OWNER_USER_ID,
  fakeUserId,
} from "../config";

export function buildSeedMembers(): Prisma.MemberCreateManyInput[] {
  const createdAt = new Date("2025-02-01T08:00:00Z");
  const rows: Prisma.MemberCreateManyInput[] = [];

  const [alpha, beta] = ORGANIZATIONS;

  rows.push({
    id: "seed_member_owner_alpha",
    organizationId: alpha.id,
    userId: OWNER_USER_ID,
    role: MembershipRole.OWNER,
    createdAt,
  });

  rows.push({
    id: "seed_member_owner_beta",
    organizationId: beta.id,
    userId: OWNER_USER_ID,
    role: MembershipRole.ADMIN,
    createdAt: new Date(createdAt.getTime() + 86_400_000),
  });

  for (let i = 0; i < FAKE_USER_COUNT; i++) {
    const inAlpha = i < ALPHA_FAKE_MEMBER_COUNT;
    const org = inAlpha ? alpha : beta;
    const role =
      i === 1 || i === ALPHA_FAKE_MEMBER_COUNT
        ? MembershipRole.ADMIN
        : MembershipRole.MEMBER;

    rows.push({
      id: `seed_member_${String(i).padStart(3, "0")}`,
      organizationId: org.id,
      userId: fakeUserId(i),
      role,
      createdAt: new Date(createdAt.getTime() + (i + 2) * 3_600_000),
      metadata: inAlpha ? { cohort: "alpha" } : { cohort: "beta" },
    });
  }

  return rows;
}
