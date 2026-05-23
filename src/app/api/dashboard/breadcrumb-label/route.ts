import { NextResponse } from "next/server";
import {
  type BreadcrumbEntityRef,
  breadcrumbEntityKey,
  parseBreadcrumbEntityListParam,
} from "@/app/dashboard/lib/breadcrumbs/breadcrumb-entity";
import { resolveBreadcrumbLabels } from "@/app/dashboard/lib/breadcrumbs/resolve-breadcrumb-labels";
import { getSessionCached } from "@/lib/auth-session";

export async function GET(request: Request) {
  const session = await getSessionCached();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const entity = searchParams.get("entity");
  const id = searchParams.get("id")?.trim();

  const entities = parseBreadcrumbEntityListParam(
    entity && id ? `${entity}:${id}` : null,
  );
  const ref: BreadcrumbEntityRef | undefined = entities[0];

  if (!ref) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }

  const labels = await resolveBreadcrumbLabels(session.user.id, [ref]);
  const label = labels[breadcrumbEntityKey(ref)] ?? null;

  return NextResponse.json({ label });
}
