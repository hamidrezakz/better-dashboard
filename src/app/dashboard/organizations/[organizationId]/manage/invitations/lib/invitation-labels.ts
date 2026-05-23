import type { InvitationJoinScope } from "@/app/join/lib/invitation-scope";
import { badgeLabels } from "@/lib/badge-labels";

export const invitationJoinScopeToggleLabels: Record<
  Exclude<InvitationJoinScope, "unknown">,
  string
> = {
  organization: badgeLabels.invitationJoinScope.organization,
  team: badgeLabels.invitationJoinScope.team,
  organization_and_team: badgeLabels.invitationJoinScope.organization_and_team,
};

export const JOIN_SCOPE_OPTIONS = [
  "organization",
  "team",
  "organization_and_team",
] as const satisfies readonly Exclude<InvitationJoinScope, "unknown">[];
