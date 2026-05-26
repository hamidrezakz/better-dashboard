import { getInvitationDisplayStatusBadgeConfig } from "@/components/badge/badge-config";
import { LabeledBadge } from "@/components/badge/labeled-badge";
import type { InvitationDisplayInput } from "@/lib/badge/invitation-display-status";

export function InvitationDisplayStatusBadge({
  invitation,
}: {
  invitation: InvitationDisplayInput;
}) {
  return (
    <LabeledBadge {...getInvitationDisplayStatusBadgeConfig(invitation)} />
  );
}
