import { format, formatDistanceToNow } from "date-fns";

export function formatSessionSignedIn(iso: string) {
  const date = new Date(iso);
  return formatDistanceToNow(date, { addSuffix: true });
}

export function formatSessionExpires(iso: string) {
  return format(new Date(iso), "MMM d, yyyy");
}

/** Hide loopback / empty IPv6 placeholders; keep real addresses for context. */
export function formatSessionIpAddress(
  ipAddress: string | null,
): string | null {
  if (!ipAddress?.trim()) {
    return null;
  }

  const ip = ipAddress.trim();

  if (ip === "127.0.0.1" || ip === "::1") {
    return null;
  }

  if (isUnspecifiedIpv6(ip)) {
    return null;
  }

  return ip;
}

function isUnspecifiedIpv6(ip: string) {
  const normalized = ip.toLowerCase();
  if (!normalized.includes(":")) {
    return false;
  }

  const collapsed = normalized.replace(/^::/, "0:").replace(/::$/, ":0");
  const parts = collapsed.split(":").filter(Boolean);
  if (parts.length === 0) {
    return true;
  }

  return parts.every((part) => /^0+$/.test(part));
}
