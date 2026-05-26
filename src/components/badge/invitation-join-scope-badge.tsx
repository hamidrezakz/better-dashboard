import type { InvitationJoinScope } from "@/app/join/lib/invitation-scope";
import { getInvitationJoinScopeBadgeConfig } from "@/components/badge/badge-config";
import { LabeledBadge } from "@/components/badge/labeled-badge";

export function InvitationJoinScopeBadge({
  scope,
}: {
  scope: InvitationJoinScope | string;
}) {
  return <LabeledBadge {...getInvitationJoinScopeBadgeConfig(scope)} />;
}
