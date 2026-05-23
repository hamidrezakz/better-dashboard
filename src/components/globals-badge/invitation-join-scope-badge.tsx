import type { InvitationJoinScope } from "@/app/join/lib/invitation-scope";
import { getInvitationJoinScopeBadgeConfig } from "@/components/globals-badge/badge-config";
import { GlobalBadge } from "@/components/globals-badge/global-badge";

export function InvitationJoinScopeBadge({
  scope,
}: {
  scope: InvitationJoinScope | string;
}) {
  return <GlobalBadge {...getInvitationJoinScopeBadgeConfig(scope)} />;
}
