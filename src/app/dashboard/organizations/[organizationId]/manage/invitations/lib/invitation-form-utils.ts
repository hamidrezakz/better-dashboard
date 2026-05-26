import type { InvitationJoinScope } from "@/app/join/lib/invitation-scope";
import { resolveInvitationJoinScope } from "@/app/join/lib/invitation-scope";
import { TEAM_INVITATION_JOIN_SCOPES } from "@/app/dashboard/organizations/[organizationId]/manage/invitations/lib/invitation-join-scope-options";

export const TEAM_NONE_VALUE = "__none__";

export const INVITATION_CONTACT_LABEL = "Share link";

export type OrganizationInvitationItem = {
  id: string;
  organizationId: string | null;
  teamId: string | null;
  teamName: string | null;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string;
  createdAt: string;
  inviterName: string;
};

export type InvitationJoinScopeOption = Exclude<InvitationJoinScope, "unknown">;

export type InvitationFormState = {
  joinScope: InvitationJoinScopeOption;
  teamId: string;
  expiresAt: string;
  maxUses: string;
};

export function getDefaultExpirationDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().slice(0, 10);
}

export function toDateInputValue(value: string) {
  return value.slice(0, 10);
}

export function parsePositiveNumberInput(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const parsed = Number.parseInt(trimmed, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return -1;
  }

  return parsed;
}

export function getInvitationContactLabel() {
  return INVITATION_CONTACT_LABEL;
}

export const INVITATIONS_DEFAULT_PAGE_SIZE = 10;

export { buildDataTablePageNumbers as buildInvitationPageNumbers } from "@/lib/data-table/pagination";

export function getDefaultInvitationFormState(): InvitationFormState {
  return {
    joinScope: "organization",
    teamId: TEAM_NONE_VALUE,
    expiresAt: getDefaultExpirationDate(),
    maxUses: "",
  };
}

export function invitationToFormState(
  invitation: OrganizationInvitationItem,
): InvitationFormState {
  const resolvedScope = resolveInvitationJoinScope({
    organizationId: invitation.organizationId,
    teamId: invitation.teamId,
  });
  const joinScope: InvitationJoinScopeOption =
    resolvedScope === "unknown" ? "organization" : resolvedScope;

  return {
    joinScope,
    teamId: invitation.teamId ?? TEAM_NONE_VALUE,
    expiresAt: toDateInputValue(invitation.expiresAt),
    maxUses: invitation.maxUses?.toString() ?? "",
  };
}

export function isInvitationFormValid(form: InvitationFormState) {
  if (!form.expiresAt) {
    return false;
  }

  if (
    joinScopeRequiresTeam(form.joinScope) &&
    form.teamId === TEAM_NONE_VALUE
  ) {
    return false;
  }

  return true;
}

export function joinScopeRequiresTeam(joinScope: InvitationJoinScope) {
  return (
    TEAM_INVITATION_JOIN_SCOPES as readonly InvitationJoinScope[]
  ).includes(joinScope);
}

export function joinScopeIncludesOrganization(joinScope: InvitationJoinScope) {
  return joinScope === "organization" || joinScope === "organization_and_team";
}
