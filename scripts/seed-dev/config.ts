/** Development-only seed. Safe to delete via `pnpm seed:dev:clear`. */

export const SEED_MARKER = "seed-dev";

/** Your signed-up user — owner of primary org. */
export const OWNER_USER_ID = "dB4lKslhSj82m2FbKkVXl8qRQET8Nrov";

/** Fake users that become org members (not counting your owner account). */
export const FAKE_USER_COUNT = 274;

/** Fake members in org alpha; the rest join beta (~70% / 30%). */
export const ALPHA_FAKE_MEMBER_COUNT = Math.floor(FAKE_USER_COUNT * 0.7);

export const ORGANIZATIONS = [
  {
    id: "seed_org_alpha",
    name: "آزمایشگاه آلفا",
    slug: "seed-org-alpha",
  },
  {
    id: "seed_org_beta",
    name: "آزمایشگاه بتا",
    slug: "seed-org-beta",
  },
] as const;

export const TEAMS_PER_ORG = 3;

export const INVITATION_COUNT = 96;

export const NOTIFICATION_COUNT = 128;

export const USER_EMAIL_DOMAIN = "dev.namazi.local";

export function fakeUserEmail(index: number) {
  return `seed.user.${String(index).padStart(3, "0")}@${USER_EMAIL_DOMAIN}`;
}

export function fakeUserId(index: number) {
  return `seed_user_${String(index).padStart(3, "0")}`;
}

export function teamId(orgIndex: number, teamIndex: number) {
  return `seed_team_${orgIndex}_${teamIndex}`;
}
