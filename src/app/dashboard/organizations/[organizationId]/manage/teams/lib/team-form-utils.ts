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
    return "Team name is required.";
  }

  if (name.length > TEAM_NAME_MAX_LENGTH) {
    return `Team name must be at most ${TEAM_NAME_MAX_LENGTH} characters.`;
  }

  return null;
}
