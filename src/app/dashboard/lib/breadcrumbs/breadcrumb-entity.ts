/** Dynamic trail segments: IDs under `users/` or `organizations/` in the URL. */
export type EntityType = "user" | "organization";

export type EntityRef = {
  type: EntityType;
  id: string;
};

const PARENT_TO_ENTITY: Record<string, EntityType> = {
  users: "user",
  organizations: "organization",
};

/** Map key in API JSON and client state, e.g. `organization:abc`. */
export function entityKey(ref: EntityRef): string {
  return `${ref.type}:${ref.id}`;
}

export function parentEntityType(
  parentSegment: string | undefined,
): EntityType | null {
  if (!parentSegment) {
    return null;
  }
  return PARENT_TO_ENTITY[parentSegment] ?? null;
}

export function entitiesInSegments(segments: string[]): EntityRef[] {
  const out: EntityRef[] = [];

  for (let i = 0; i < segments.length; i++) {
    const type = parentEntityType(segments[i - 1]);
    if (type) {
      out.push({ type, id: segments[i] });
    }
  }

  return out;
}

/** Parses `items` on `/api/dashboard/breadcrumb-labels` (`user:id,organization:id`). */
export function parseEntitiesQuery(raw: string | null): EntityRef[] {
  if (!raw?.trim()) {
    return [];
  }

  const out: EntityRef[] = [];

  for (const part of raw.split(",")) {
    const trimmed = part.trim();
    if (!trimmed) {
      continue;
    }
    const colon = trimmed.indexOf(":");
    if (colon <= 0) {
      continue;
    }
    const type = trimmed.slice(0, colon);
    const id = trimmed.slice(colon + 1).trim();
    if ((type === "user" || type === "organization") && id) {
      out.push({ type, id });
    }
  }

  return out;
}

export function formatEntitiesQuery(entities: EntityRef[]): string {
  return entities.map(entityKey).join(",");
}
