export const TEAM_NAME_MAX_LENGTH = 120;

export type OrganizationTeamItem = {
  id: string;
  name: string;
  memberCount: number;
  createdAt: string;
};

export type OrganizationOutsiderTeamMemberItem = {
  id: string;
  teamName: string;
  userName: string;
  userEmail: string;
};

export function normalizeTeamName(value: string) {
  return value.trim();
}

export function validateTeamName(value: string): string | null {
  const name = normalizeTeamName(value);

  if (!name) {
    return "نام تیم الزامی است.";
  }

  if (name.length > TEAM_NAME_MAX_LENGTH) {
    return `نام تیم حداکثر ${TEAM_NAME_MAX_LENGTH} کاراکتر می‌تواند باشد.`;
  }

  return null;
}
