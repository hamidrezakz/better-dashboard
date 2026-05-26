import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { buildAuthRouteWithRedirect } from "@/lib/auth/redirect";

export type AppSession = Awaited<ReturnType<typeof auth.api.getSession>>;
export type AuthenticatedAppSession = NonNullable<AppSession>;

/** Request-scoped session read. See docs/agents/implementation.md § Auth / session. */
export const getSessionCached = cache(async () => {
  const requestHeaders = await headers();
  return auth.api.getSession({ headers: requestHeaders });
});

/**
 * Ensures a signed-in user; otherwise redirects to login.
 * Default `redirectTo` is `/dashboard`. Pass a custom path only outside the dashboard layout (e.g. join).
 */
export const requireAuthSession = cache(
  async (
    redirectTo: string = "/dashboard",
  ): Promise<AuthenticatedAppSession> => {
    const session = await getSessionCached();

    if (!session?.user) {
      redirect(buildAuthRouteWithRedirect("/login", redirectTo));
    }

    return session;
  },
);
