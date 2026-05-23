import { NextResponse } from "next/server";
import { resolveBreadcrumbLabels } from "@/app/dashboard/lib/breadcrumbs/resolve-breadcrumb-labels";
import { getSessionCached } from "@/lib/auth-session";

type EntityType = "user" | "organization";

function isEntityType(value: string | null): value is EntityType {
  return value === "user" || value === "organization";
}

export async function GET(request: Request) {
  const session = await getSessionCached();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const entity = searchParams.get("entity");
  const id = searchParams.get("id")?.trim();

  if (!isEntityType(entity) || !id) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }

  const labels = await resolveBreadcrumbLabels(session.user.id, [
    { type: entity, id },
  ]);
  const label = labels[`${entity}:${id}`] ?? null;

  return NextResponse.json({ label });
}
