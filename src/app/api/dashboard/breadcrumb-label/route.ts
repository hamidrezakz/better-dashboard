import { NextResponse } from "next/server";
import {
  type EntityRef,
  entityKey,
  parseEntitiesQuery,
} from "@/app/dashboard/lib/breadcrumbs/breadcrumb-entity";
import { resolveEntityLabels } from "@/app/dashboard/lib/breadcrumbs/resolve-breadcrumb-labels";
import { getSessionCached } from "@/lib/auth-session";

export async function GET(request: Request) {
  const session = await getSessionCached();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const entity = searchParams.get("entity");
  const id = searchParams.get("id")?.trim();

  const entities = parseEntitiesQuery(entity && id ? `${entity}:${id}` : null);
  const ref: EntityRef | undefined = entities[0];

  if (!ref) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }

  const labels = await resolveEntityLabels(session.user.id, [ref]);
  const label = labels[entityKey(ref)] ?? null;

  return NextResponse.json({ label });
}
