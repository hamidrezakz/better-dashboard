import { NextResponse } from "next/server";
import { parseEntitiesQuery } from "@/app/dashboard/lib/breadcrumbs/breadcrumb-entity";
import { resolveEntityLabels } from "@/app/dashboard/lib/breadcrumbs/resolve-breadcrumb-labels";
import { getSessionCached } from "@/lib/session";

export async function GET(request: Request) {
  const session = await getSessionCached();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const entities = parseEntitiesQuery(searchParams.get("items"));

  if (!entities.length) {
    return NextResponse.json({ labels: {} });
  }

  const labels = await resolveEntityLabels(session.user.id, entities);

  return NextResponse.json({ labels });
}
