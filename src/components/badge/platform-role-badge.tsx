import { getPlatformRoleBadgeConfig } from "@/components/badge/badge-config";
import { LabeledBadge } from "@/components/badge/labeled-badge";
import type { UserRole } from "@/generated/prisma/enums";

export function PlatformRoleBadge({ role }: { role: UserRole | string }) {
  return <LabeledBadge {...getPlatformRoleBadgeConfig(role)} />;
}
