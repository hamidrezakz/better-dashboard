export type UserProfileDisplay = {
  name: string;
  email?: string;
  image?: string | null;
};

/** Display initials from a person's name (avatar fallback). */
export function getUserInitials(name: string, emptyFallback = "?"): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return emptyFallback;
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 1).toUpperCase();
  }

  return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
}
