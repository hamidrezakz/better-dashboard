import { getRoleBadgeConfig } from "@/components/badge/badge-config";
import { LabeledBadge } from "@/components/badge/labeled-badge";
import type { MembershipRole } from "@/generated/prisma/enums";

export function RoleBadge({ role }: { role: MembershipRole | string }) {
  return <LabeledBadge {...getRoleBadgeConfig(role)} />;
}
