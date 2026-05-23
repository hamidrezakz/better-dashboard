import type { InvitationJoinScopeOption } from "@/app/dashboard/organizations/[organizationId]/manage/invitations/lib/invitation-form-utils";

export type InvitationMutationInput = {
  joinScope: InvitationJoinScopeOption;
  teamId?: string;
  expiresAt: string;
  maxUses?: number | null;
};

export type ResolvedInvitationPersistence = {
  organizationId: string | null;
  teamId: string | null;
};

function normalizeOptionalText(value?: string) {
  const normalized = value?.trim() ?? "";
  return normalized.length ? normalized : null;
}

export function parseInvitationExpiresAt(value: string) {
  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  const date = new Date(`${normalized}T23:59:59`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export function normalizeInvitationMaxUses(value?: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  const normalized = Math.trunc(value);

  if (normalized <= 0) {
    return -1;
  }

  return normalized;
}

export function resolveInvitationMaxUsesForSave(maxUses?: number | null) {
  return normalizeInvitationMaxUses(maxUses);
}

export function resolveInvitationPersistence(input: {
  organizationId: string;
  joinScope: InvitationJoinScopeOption;
  teamId?: string;
}):
  | { ok: true; data: ResolvedInvitationPersistence }
  | { ok: false; error: string } {
  if (
    input.joinScope !== "organization" &&
    input.joinScope !== "team" &&
    input.joinScope !== "organization_and_team"
  ) {
    return { ok: false, error: "نوع دعوت انتخاب‌شده معتبر نیست." };
  }

  const teamId = normalizeOptionalText(input.teamId);

  if (
    (input.joinScope === "team" ||
      input.joinScope === "organization_and_team") &&
    !teamId
  ) {
    return { ok: false, error: "برای این نوع دعوت، انتخاب تیم الزامی است." };
  }

  const includesOrganization =
    input.joinScope === "organization" ||
    input.joinScope === "organization_and_team";

  const organizationId = includesOrganization ? input.organizationId : null;
  const resolvedTeamId = input.joinScope === "organization" ? null : teamId;

  return {
    ok: true,
    data: {
      organizationId,
      teamId: resolvedTeamId,
    },
  };
}
