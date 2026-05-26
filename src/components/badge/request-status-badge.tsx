import { getRequestStatusBadgeConfig } from "@/components/globals-badge/badge-config";
import { GlobalBadge } from "@/components/globals-badge/global-badge";
import type { NotificationType } from "@/generated/prisma/enums";

export function RequestStatusBadge({
  status,
}: {
  status: NotificationType | string;
}) {
  return <GlobalBadge {...getRequestStatusBadgeConfig(status)} />;
}
