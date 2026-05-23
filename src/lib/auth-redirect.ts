const DEFAULT_AUTH_REDIRECT_PATH = "/dashboard";

export function normalizeAuthRedirectTarget(
  value: string | null | undefined,
  fallback: string = DEFAULT_AUTH_REDIRECT_PATH,
) {
  if (!value) {
    return fallback;
  }

  // Prevent protocol-relative and absolute URL redirects.
  if (!value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}

export function buildAuthRouteWithRedirect(
  route: "/login" | "/signup",
  redirectTo: string,
) {
  const normalizedRedirect = normalizeAuthRedirectTarget(redirectTo);
  const params = new URLSearchParams({
    redirect: normalizedRedirect,
  });
  return `${route}?${params.toString()}`;
}
