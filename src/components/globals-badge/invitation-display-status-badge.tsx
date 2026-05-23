import { getInvitationDisplayStatusBadgeConfig } from "@/components/globals-badge/badge-config";
import { GlobalBadge } from "@/components/globals-badge/global-badge";
import type { InvitationDisplayInput } from "@/lib/invitation-display-status";

export function InvitationDisplayStatusBadge({
  invitation,
}: {
  invitation: InvitationDisplayInput;
}) {
  return (
    <GlobalBadge {...getInvitationDisplayStatusBadgeConfig(invitation)} />
  );
}
