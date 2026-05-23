import { getRoleBadgeConfig } from "@/components/globals-badge/badge-config";
import { GlobalBadge } from "@/components/globals-badge/global-badge";
import type { MembershipRole } from "@/generated/prisma/enums";

export function RoleBadge({ role }: { role: MembershipRole | string }) {
  return <GlobalBadge {...getRoleBadgeConfig(role)} />;
}
