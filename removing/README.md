# Removing dashboard features

Recommended after your first local run — see [docs/getting-started.md](../docs/getting-started.md).

Optional slices can be deleted from a fork. Each guide is one file, named after the feature. Work through a guide top to bottom, then run `pnpm run build`.

| Feature                    | Guide                                                            |
| -------------------------- | ---------------------------------------------------------------- |
| Organization teams         | [teams.md](./teams.md)                                           |
| Organization members       | [members.md](./members.md)                                       |
| Organization invitations   | [invitations.md](./invitations.md)                               |
| Organization notifications | [organization-notifications.md](./organization-notifications.md) |
| User notifications         | [user-notifications.md](./user-notifications.md)                 |

**Registry:** org manage tabs are listed in [`src/app/dashboard/lib/dashboard-slices.ts`](../src/app/dashboard/lib/dashboard-slices.ts). Remove the slice entry when you drop a tab.

**Search helpers when trimming:**

- `TEAMS_SLICE` — members UI tied to teams
- `grep -r <feature> src` after deleting route trees to catch SSOT leftovers
