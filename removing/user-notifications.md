# Removing user notifications

User-scoped notifications at `/dashboard/notifications`. Separate from [organization notifications](./organization-notifications.md).

## 1. Route and action trees

Delete:

- `src/app/dashboard/(user)/notifications/`
- `src/app/action/dashboard/users/notifications/`

## 2. Segment registry and SSOT

| File                                            | Change                                  |
| ----------------------------------------------- | --------------------------------------- |
| `src/app/dashboard/lib/dashboard-routes.ts`     | Remove `userNotifications`              |
| `src/app/dashboard/lib/cache-tags.ts`           | Remove `userNotificationsByUserId`      |
| `src/app/dashboard/lib/dashboard-nav-labels.ts` | Remove user notification sidebar labels |

Note: user notifications are not in `dashboard-slices.ts` (org manage tabs only).

## 3. Shared chrome

- `src/app/dashboard/components/notifications/header-notifications-dropdown.tsx` — remove from dashboard header or replace
- `src/app/dashboard/components/notifications/notification-view-dialog.tsx` — delete if only used here
- `src/components/badge/notification-type-badge.tsx` — delete if unused

## 4. Verify

```bash
pnpm run build
```
