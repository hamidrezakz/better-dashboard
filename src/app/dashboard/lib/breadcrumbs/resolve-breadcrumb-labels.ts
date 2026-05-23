import {
  type BreadcrumbEntityRef,
  type BreadcrumbEntityType,
  breadcrumbEntityKey,
} from "@/app/dashboard/lib/breadcrumbs/breadcrumb-entity";
import {
  canAccessOrganization,
  canAccessUserProfile,
} from "@/app/dashboard/lib/dashboard-access";
import { prisma } from "@/lib/prisma";

export type { BreadcrumbEntityRef } from "@/app/dashboard/lib/breadcrumbs/breadcrumb-entity";

export type BreadcrumbLabelsResult = Record<string, string | null>;

const resolveLabel: Record<
  BreadcrumbEntityType,
  (viewerUserId: string, entityId: string) => Promise<string | null>
> = {
  user: async (viewerUserId, entityId) => {
    if (
      !(await canAccessUserProfile({
        viewerUserId,
        targetUserId: entityId,
      }))
    ) {
      return null;
    }
    const user = await prisma.user.findUnique({
      where: { id: entityId },
      select: { name: true },
    });
    return user?.name?.trim() ?? null;
  },
  organization: async (viewerUserId, entityId) => {
    if (
      !(await canAccessOrganization({
        viewerUserId,
        organizationId: entityId,
      }))
    ) {
      return null;
    }
    const organization = await prisma.organization.findUnique({
      where: { id: entityId },
      select: { name: true },
    });
    return organization?.name?.trim() ?? null;
  },
};

export async function resolveBreadcrumbLabels(
  viewerUserId: string,
  entities: BreadcrumbEntityRef[],
): Promise<BreadcrumbLabelsResult> {
  const unique = new Map<string, BreadcrumbEntityRef>();

  for (const entity of entities) {
    const id = entity.id.trim();
    if (!id) {
      continue;
    }
    const ref: BreadcrumbEntityRef = { type: entity.type, id };
    unique.set(breadcrumbEntityKey(ref), ref);
  }

  const result: BreadcrumbLabelsResult = {};

  await Promise.all(
    [...unique.values()].map(async (entity) => {
      const key = breadcrumbEntityKey(entity);
      result[key] = await resolveLabel[entity.type](viewerUserId, entity.id);
    }),
  );

  return result;
}
