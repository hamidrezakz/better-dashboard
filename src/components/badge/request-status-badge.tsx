import { getRequestStatusBadgeConfig } from "@/components/badge/badge-config";
import { LabeledBadge } from "@/components/badge/labeled-badge";
import type { NotificationType } from "@/generated/prisma/enums";

export function RequestStatusBadge({
  status,
}: {
  status: NotificationType | string;
}) {
  return <LabeledBadge {...getRequestStatusBadgeConfig(status)} />;
}
