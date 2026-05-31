import {
  type EntityRef,
  type EntityType,
  entityKey,
} from "@/app/dashboard/lib/breadcrumbs/breadcrumb-entity";
import {
  canAccessOrganization,
  canAccessOrganizationTeamView,
} from "@/app/dashboard/lib/dashboard-access";
import { prisma } from "@/lib/prisma";

export type { EntityRef } from "@/app/dashboard/lib/breadcrumbs/breadcrumb-entity";

export type EntityLabels = Record<string, string | null>;

const fetchLabel: Record<
  EntityType,
  (viewerUserId: string, id: string) => Promise<string | null>
> = {
  organization: async (viewerUserId, id) => {
    if (!(await canAccessOrganization({ viewerUserId, organizationId: id }))) {
      return null;
    }
    const organization = await prisma.organization.findUnique({
      where: { id },
      select: { name: true },
    });
    return organization?.name?.trim() ?? null;
  },
  team: async (viewerUserId, id) => {
    const team = await prisma.team.findUnique({
      where: { id },
      select: {
        name: true,
        organizationId: true,
      },
    });

    if (!team) {
      return null;
    }

    if (
      !(await canAccessOrganizationTeamView({
        viewerUserId,
        organizationId: team.organizationId,
        teamId: id,
      }))
    ) {
      return null;
    }

    return team.name?.trim() ?? null;
  },
};

export async function resolveEntityLabels(
  viewerUserId: string,
  entities: EntityRef[],
): Promise<EntityLabels> {
  const unique = new Map<string, EntityRef>();

  for (const entity of entities) {
    const id = entity.id.trim();
    if (!id) {
      continue;
    }
    const ref: EntityRef = { type: entity.type, id };
    unique.set(entityKey(ref), ref);
  }

  const labels: EntityLabels = {};

  await Promise.all(
    [...unique.values()].map(async (ref) => {
      labels[entityKey(ref)] = await fetchLabel[ref.type](viewerUserId, ref.id);
    }),
  );

  return labels;
}
