# Removing organization teams

Checklist for forks that do not need Better Auth teams. Work top to bottom.

## 1. Route and action trees

Delete:

- `src/app/dashboard/organizations/[organizationId]/manage/teams/`
- `src/app/action/dashboard/organizations/manage/teams/`

Includes `teams/lib/organization-team-access.ts` and all `teams/components/*`, `teams/[teamId]/*`.

## 2. Segment registry and SSOT

| File                                                                                           | Change                                                                                                                                                                               |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/app/dashboard/lib/dashboard-slices.ts`                                                    | Remove the `teams` entry                                                                                                                                                             |
| `src/app/dashboard/lib/dashboard-routes.ts`                                                    | Remove `teams` from `dashboardRouteSegments` (if unused), `organizationManageTabPathSuffix` union, and `organizationTeams` / `organizationTeam` / `organizationTeamMembers` builders |
| `src/app/dashboard/lib/cache-tags.ts`                                                          | Remove `organizationTeamsById`                                                                                                                                                       |
| `src/app/dashboard/lib/dashboard-nav-labels.ts`                                                | Remove team-related labels (`manageTabs.teams`, sidebar team strings, etc.)                                                                                                          |
| `src/app/dashboard/lib/breadcrumbs/breadcrumb-entity.ts`                                       | Remove `teams` segment mapping                                                                                                                                                       |
| `src/app/action/dashboard/organizations/manage/shared/invalidate-organization-manage-cache.ts` | Remove `invalidateOrganizationTeamsCache` and its use inside `invalidateOrganizationManageCache`                                                                                     |

## 3. Members coupling (`TEAMS_SLICE`)

Search `TEAMS_SLICE` under `manage/members/`. See also [members.md](./members.md).

- Delete `member-teams-form-shell.tsx`, `set-organization-member-teams-action.ts`
- In `member-management-panel.tsx`, `members-table.tsx`, `member-row-actions-menu.tsx`: remove teams UI and props
- In `get-organization-members-page.ts`: drop `teams` from `OrganizationMemberItem` and related queries
- Member actions: remove `invalidateOrganizationTeamsCache` calls if only needed for teams

## 4. Invitations coupling

See [invitations.md](./invitations.md) (teams section).

- `invitations/lib/invitation-join-scope-options.ts`: use `joinScopeOptionsWithoutTeams()` in the form; delete team scopes from `JOIN_SCOPE_OPTIONS`
- `invitation-form.tsx`: organization-only scope UI
- Invitation create/update actions: stop sending `teamId` for team scopes
- Table/dialogs: remove team join scope badges or narrow to organization-only
- `src/app/join/`: adjust scope handling if needed

## 5. Auth and database

1. `src/lib/auth/index.ts`: set `organization({ teams: { enabled: false } })` or remove the `teams` block per Better Auth docs
2. `pnpm run auth:generate`
3. Create and apply a Prisma migration (drop `Team` / `TeamMember` tables when safe for your data)
4. Update `pnpm run seed:dev` if it creates teams

## 6. Other references

- `src/app/action/dashboard/users/search-users-action.ts`: remove team-scoped user search if present
- Org summary / home pages: remove team counts or links
- `src/components/badge/`: keep or trim invitation join-scope badge variants

## 7. Verify

```bash
pnpm run build
pnpm exec tsc --noEmit
```

Smoke-test: org manage tabs, members list, invitations, join flow.
