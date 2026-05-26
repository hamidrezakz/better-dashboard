import { getNotificationTypeBadgeConfig } from "@/components/globals-badge/badge-config";
import { GlobalBadge } from "@/components/globals-badge/global-badge";
import { Badge } from "@/components/ui/badge";
import type { NotificationType } from "@/generated/prisma/enums";

export function NotificationTypeBadge({
  type,
  compact = false,
}: {
  type: NotificationType | string;
  compact?: boolean;
}) {
  const config = getNotificationTypeBadgeConfig(type);

  if (!compact) {
    return <GlobalBadge {...config} />;
  }

  return (
    <Badge
      variant={config.variant}
      className="h-4 shrink-0 gap-0.5 px-1.5 py-0 text-[0.5625rem] font-normal [&>svg]:size-2"
    >
      {config.icon}
      {config.label}
    </Badge>
  );
}
