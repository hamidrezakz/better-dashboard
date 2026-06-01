/** Auth-scoped invitation targets supported in phase 1. Extend in later phases. */
export type InvitationJoinScope =
  | "organization"
  | "team"
  | "organization_and_team"
  | "unknown";

export function resolveInvitationJoinScope(input: {
  organizationId: string | null;
  teamId: string | null;
}): InvitationJoinScope {
  if (input.organizationId && input.teamId) {
    return "organization_and_team";
  }

  if (input.organizationId) {
    return "organization";
  }

  if (input.teamId) {
    return "team";
  }

  return "unknown";
}

export const invitationJoinScopeLabels: Record<InvitationJoinScope, string> = {
  organization: "پیوستن به سازمان",
  team: "پیوستن به تیم",
  organization_and_team: "پیوستن به سازمان و تیم",
  unknown: "دعوت‌نامه",
};
