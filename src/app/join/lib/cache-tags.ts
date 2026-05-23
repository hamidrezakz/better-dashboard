export const joinCacheTags = {
  invitationById: (invitationId: string) => `join:invitation:${invitationId}`,
} as const;
