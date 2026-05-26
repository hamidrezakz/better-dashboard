import type { InvitationJoinScope } from "@/app/join/lib/invitation-scope";
import { badgeLabels } from "@/lib/badge/badge-labels";

export { JOIN_SCOPE_OPTIONS } from "@/app/dashboard/organizations/[organizationId]/manage/invitations/lib/invitation-join-scope-options";

export const invitationJoinScopeToggleLabels: Record<
  Exclude<InvitationJoinScope, "unknown">,
  string
> = {
  organization: badgeLabels.invitationJoinScope.organization,
  team: badgeLabels.invitationJoinScope.team,
  organization_and_team: badgeLabels.invitationJoinScope.organization_and_team,
};
