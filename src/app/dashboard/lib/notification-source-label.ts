export type NotificationSourcePart = {
  label: string;
  value: string;
};

export function getNotificationSourceParts(input: {
  organizationName: string | null;
  teamName: string | null;
  createdByName: string | null;
}): NotificationSourcePart[] {
  const parts: NotificationSourcePart[] = [];

  if (input.organizationName) {
    parts.push({ label: "سازمان", value: input.organizationName });
  }
  if (input.teamName) {
    parts.push({ label: "تیم", value: input.teamName });
  }
  if (input.createdByName) {
    parts.push({ label: "ارسال‌کننده", value: input.createdByName });
  }

  return parts;
}

export function buildNotificationSourceLabel(input: {
  organizationName: string | null;
  teamName: string | null;
  createdByName: string | null;
}): string | null {
  const parts = getNotificationSourceParts(input);

  return parts.length > 0
    ? parts.map((part) => `${part.label}: ${part.value}`).join(" · ")
    : null;
}

/** Compact source line for dense UI (values only, pipe-separated). */
export function buildNotificationSourceInline(input: {
  organizationName: string | null;
  teamName: string | null;
  createdByName: string | null;
}): string | null {
  const parts = getNotificationSourceParts(input);

  return parts.length > 0 ? parts.map((part) => part.value).join(" | ") : null;
}
