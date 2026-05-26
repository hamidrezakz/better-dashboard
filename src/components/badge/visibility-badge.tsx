import { getVisibilityBadgeConfig } from "@/components/globals-badge/badge-config";
import { GlobalBadge } from "@/components/globals-badge/global-badge";
import type { NotificationAudience } from "@/generated/prisma/enums";

export function VisibilityBadge({
  visibility,
}: {
  visibility: NotificationAudience | string;
}) {
  return <GlobalBadge {...getVisibilityBadgeConfig(visibility)} />;
}
