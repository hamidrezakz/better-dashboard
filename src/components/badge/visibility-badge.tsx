import { getVisibilityBadgeConfig } from "@/components/badge/badge-config";
import { LabeledBadge } from "@/components/badge/labeled-badge";
import type { NotificationAudience } from "@/generated/prisma/enums";

export function VisibilityBadge({
  visibility,
}: {
  visibility: NotificationAudience | string;
}) {
  return <LabeledBadge {...getVisibilityBadgeConfig(visibility)} />;
}
