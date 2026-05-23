export type InvitationDisplayStatus = "active_link" | "expired" | "exhausted";

export type InvitationDisplayInput = {
  expiresAt: string;
  usedCount: number;
  maxUses: number | null;
};

export function invitationIsExpired(expiresAt: string, now = Date.now()) {
  return new Date(expiresAt).getTime() <= now;
}

export function invitationIsExhausted(
  usedCount: number,
  maxUses: number | null,
) {
  return maxUses !== null && usedCount >= maxUses;
}

export function invitationIsConsumable(
  invitation: InvitationDisplayInput,
  now = Date.now(),
) {
  if (invitationIsExpired(invitation.expiresAt, now)) {
    return false;
  }

  return !invitationIsExhausted(invitation.usedCount, invitation.maxUses);
}

export function resolveInvitationDisplayStatus(
  invitation: InvitationDisplayInput,
  now = Date.now(),
): InvitationDisplayStatus {
  if (invitationIsExpired(invitation.expiresAt, now)) {
    return "expired";
  }

  if (invitationIsExhausted(invitation.usedCount, invitation.maxUses)) {
    return "exhausted";
  }

  return "active_link";
}

export function formatInvitationUsageLabel(
  usedCount: number,
  maxUses: number | null,
) {
  if (maxUses === null) {
    return `${usedCount} استفاده`;
  }

  return `${usedCount} از ${maxUses}`;
}
