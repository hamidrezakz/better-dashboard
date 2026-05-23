import type { InvitationJoinScope } from "@/app/join/lib/invitation-scope";

export const invitationJoinScopeToggleLabels: Record<
  Exclude<InvitationJoinScope, "unknown">,
  string
> = {
  organization: "سازمان",
  team: "تیم",
  organization_and_team: "سازمان + تیم",
};

export const JOIN_SCOPE_OPTIONS = [
  "organization",
  "team",
  "organization_and_team",
] as const satisfies readonly Exclude<InvitationJoinScope, "unknown">[];
