# Removing dashboard features

Recommended after your first local run — see [docs/getting-started.md](../docs/getting-started.md).

Optional slices can be deleted from a fork. Each guide is one file, named after the feature. Work through a guide top to bottom, then run `pnpm run build`.

| Feature                    | Guide                                                            |
| -------------------------- | ---------------------------------------------------------------- |
| Platform administration    | [admin.md](./admin.md)                                           |
| Organization teams         | [teams.md](./teams.md)                                           |
| Organization members       | [members.md](./members.md)                                       |
| Organization invitations   | [invitations.md](./invitations.md)                               |
| Organization notifications | [organization-notifications.md](./organization-notifications.md) |
| User notifications         | [user-notifications.md](./user-notifications.md)                 |

**Registries:**

- Org manage tabs: [`src/app/dashboard/lib/dashboard-slices.ts`](../src/app/dashboard/lib/dashboard-slices.ts) — remove the slice entry when you drop a tab.
- Platform admin tabs: [`src/app/dashboard/admin/lib/admin-slices.ts`](../src/app/dashboard/admin/lib/admin-slices.ts) — removed with the admin tree ([admin.md](./admin.md)).

**Search helpers when trimming:**

- `TEAMS_SLICE` — members UI tied to teams
- `isPlatformAdmin` / `adminSlices` — platform admin UI and bypasses
- `grep -r <feature> src` after deleting route trees to catch SSOT leftovers
