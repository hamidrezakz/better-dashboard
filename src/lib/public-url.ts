function trimTrailingSlashes(value: string) {
  return value.replace(/\/+$/, "");
}

export function getPublicOrigin() {
  const raw = process.env.NEXT_PUBLIC_URL?.trim();
  if (!raw) {
    return "";
  }
  return trimTrailingSlashes(raw);
}

export function toAbsolutePublicUrl(path: string) {
  const origin = getPublicOrigin();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!origin) {
    return normalizedPath;
  }
  return `${origin}${normalizedPath}`;
}
