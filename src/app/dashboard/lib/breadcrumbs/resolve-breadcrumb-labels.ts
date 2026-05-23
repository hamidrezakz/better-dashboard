import {
  canAccessOrganization,
  canAccessUserProfile,
} from "@/app/dashboard/lib/dashboard-access";
import { prisma } from "@/lib/prisma";

export type BreadcrumbEntityRef = {
  type: "user" | "organization";
  id: string;
};

export type BreadcrumbLabelsResult = Record<string, string | null>;

function entityKey(entity: BreadcrumbEntityRef) {
  return `${entity.type}:${entity.id}`;
}

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
    unique.set(entityKey({ type: entity.type, id }), {
      type: entity.type,
      id,
    });
  }

  const result: BreadcrumbLabelsResult = {};
  await Promise.all(
    [...unique.values()].map(async (entity) => {
      const key = entityKey(entity);
      result[key] = await resolveSingleLabel(viewerUserId, entity);
    }),
  );
  return result;
}

async function resolveSingleLabel(
  viewerUserId: string,
  entity: BreadcrumbEntityRef,
): Promise<string | null> {
  if (entity.type === "user") {
    const canAccess = await canAccessUserProfile({
      viewerUserId,
      targetUserId: entity.id,
    });

    if (!canAccess) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: entity.id },
      select: { name: true },
    });

    return user?.name?.trim() ?? null;
  }

  const canAccess = await canAccessOrganization({
    viewerUserId,
    organizationId: entity.id,
  });

  if (!canAccess) {
    return null;
  }

  const organization = await prisma.organization.findUnique({
    where: { id: entity.id },
    select: { name: true },
  });

  return organization?.name?.trim() ?? null;
}
