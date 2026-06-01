import { getUserAccountStatusBadgeConfig } from "@/components/badge/badge-config";
import { LabeledBadge } from "@/components/badge/labeled-badge";

export function UserAccountStatusBadge({ banned }: { banned: boolean }) {
  return (
    <LabeledBadge
      {...getUserAccountStatusBadgeConfig(banned ? "banned" : "active")}
    />
  );
}
