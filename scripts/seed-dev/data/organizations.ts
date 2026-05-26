import type { Prisma } from "@/generated/prisma/client";
import { ORGANIZATIONS } from "../config";

export function buildSeedOrganizations(): Prisma.OrganizationCreateManyInput[] {
  const base = new Date("2025-01-15T10:00:00Z");

  return ORGANIZATIONS.map((org, index) => ({
    id: org.id,
    name: org.name,
    slug: org.slug,
    logo: null,
    createdAt: new Date(base.getTime() + index * 7 * 86_400_000),
    metadata: JSON.stringify({ seed: true, label: org.slug }),
  }));
}
