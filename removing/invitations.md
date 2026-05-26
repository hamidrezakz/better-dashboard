# Removing organization invitations

## 1. Route and action trees

Delete:

- `src/app/dashboard/organizations/[organizationId]/manage/invitations/`
- `src/app/action/dashboard/organizations/manage/invitations/`

## 2. Segment registry and SSOT

| File                                        | Change                                                                 |
| ------------------------------------------- | ---------------------------------------------------------------------- |
| `src/app/dashboard/lib/dashboard-slices.ts` | Remove `invitations` entry                                             |
| `src/app/dashboard/lib/dashboard-routes.ts` | Remove `organizationInvitations`                                       |
| `src/app/dashboard/lib/cache-tags.ts`       | Remove `organizationInvitationsById`                                   |
| Invitation actions                          | Use `updateTag` on `organizationInvitationsById` — delete with actions |

## 3. Join flow

If you remove org invitations entirely, decide whether to keep `src/app/join/`:

- **Remove join:** delete `src/app/join/` and `src/app/action/join/`
- **Keep join:** ensure join still works without the manage UI (API-only or external invites)

## 4. Badge components

Trim `src/components/badge/invitation-*.tsx` if unused elsewhere.

## 5. Teams coupling

When removing **teams** but keeping invitations, update `invitations/lib/invitation-join-scope-options.ts` to organization-only scopes. Full steps: [teams.md](./teams.md) § Invitations coupling.

## 6. Verify

```bash
pnpm run build
```
