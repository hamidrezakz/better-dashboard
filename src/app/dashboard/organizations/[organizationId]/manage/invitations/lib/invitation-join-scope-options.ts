import type { InvitationJoinScope } from "@/app/join/lib/invitation-scope";
import type { InvitationJoinScopeOption } from "@/app/dashboard/organizations/[organizationId]/manage/invitations/lib/invitation-form-utils";

/** All join-scope toggle values shown in the invitation form. */
export const JOIN_SCOPE_OPTIONS = [
  "organization",
  "team",
  "organization_and_team",
] as const satisfies readonly InvitationJoinScopeOption[];

/** Scopes that require a team picker — remove with the teams slice. */
export const TEAM_INVITATION_JOIN_SCOPES = [
  "team",
  "organization_and_team",
] as const satisfies readonly InvitationJoinScope[];

export function joinScopeOptionsWithoutTeams(): readonly InvitationJoinScopeOption[] {
  return ["organization"];
}
