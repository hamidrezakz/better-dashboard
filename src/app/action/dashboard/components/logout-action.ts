"use server";

import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionCached } from "@/lib/auth/session";
import { auth } from "@/lib/auth";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";

export async function logoutAction() {
  const userId = (await getSessionCached())?.user.id ?? null;

  await auth.api.signOut({
    headers: await headers(),
  });

  if (userId) {
    revalidateTag(dashboardCacheTags.sidebarConfigByUser(userId), "seconds");
  }

  redirect("/login");
}
