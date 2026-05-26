# Removing organization members

## 1. Route and action trees

Delete:

- `src/app/dashboard/organizations/[organizationId]/manage/members/`
- `src/app/action/dashboard/organizations/manage/members/`

## 2. Segment registry and SSOT

| File                                                                                           | Change                                                       |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `src/app/dashboard/lib/dashboard-slices.ts`                                                    | Remove `members` entry                                       |
| `src/app/dashboard/lib/dashboard-routes.ts`                                                    | Remove `organizationMembers` and `members` segment           |
| `src/app/dashboard/lib/cache-tags.ts`                                                          | Remove `organizationMembersById`                             |
| `src/app/action/dashboard/organizations/manage/shared/invalidate-organization-manage-cache.ts` | Remove `invalidateOrganizationMembersCache` and references   |
| `src/app/dashboard/lib/dashboard-nav-labels.ts`                                                | Remove `memberManage.*` labels                               |
| `src/app/dashboard/lib/sidebar/organization-manage-nav-items.ts`                               | Default active tab may need a new default (e.g. invitations) |

## 3. Shared manage code

If nothing else uses them, review:

- `src/app/dashboard/organizations/[organizationId]/manage/components/organization-members-multi-combobox.tsx`
- `src/app/dashboard/organizations/[organizationId]/manage/lib/organization-member-guards.ts`

## 4. Teams coupling

If you **keep teams** but remove members, delete only member-specific actions.

If you **remove teams** first, follow [teams.md](./teams.md) and ignore `TEAMS_SLICE` markers under `members/`.

## 5. Sidebar

`src/app/dashboard/lib/sidebar/dashboard-items.ts` links managers to `organizationMembers` — point “Organization management” to another manage tab or remove the item.

## 6. Verify

```bash
pnpm run build
```
