import { NextResponse } from "next/server";
import {
  type BreadcrumbEntityRef,
  resolveBreadcrumbLabels,
} from "@/app/dashboard/lib/resolve-breadcrumb-labels";
import { getSessionCached } from "@/lib/auth-session";

function parseItemsParam(raw: string | null): BreadcrumbEntityRef[] {
  if (!raw?.trim()) {
    return [];
  }

  const entities: BreadcrumbEntityRef[] = [];

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
      entities.push({ type, id });
    }
  }

  return entities;
}

export async function GET(request: Request) {
  const session = await getSessionCached();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const entities = parseItemsParam(searchParams.get("items"));

  if (!entities.length) {
    return NextResponse.json({ labels: {} });
  }

  const labels = await resolveBreadcrumbLabels(session.user.id, entities);

  return NextResponse.json({ labels });
}
