# Removing organization notifications

Org-scoped notifications under **Organization → Manage → Notifications**. Separate from [user notifications](./user-notifications.md).

## 1. Route and action trees

Delete:

- `src/app/dashboard/organizations/[organizationId]/manage/notifications/`
- `src/app/action/dashboard/organizations/manage/notifications/`

## 2. Segment registry and SSOT

| File                                        | Change                                 |
| ------------------------------------------- | -------------------------------------- |
| `src/app/dashboard/lib/dashboard-slices.ts` | Remove `notifications` entry           |
| `src/app/dashboard/lib/dashboard-routes.ts` | Remove `organizationNotifications`     |
| `src/app/dashboard/lib/cache-tags.ts`       | Remove `organizationNotificationsById` |

## 3. Shared dashboard chrome

Check whether these are still needed for **user** notifications:

- `src/app/dashboard/components/notifications/` (header dropdown, view dialog)
- `src/app/dashboard/lib/notifications/notification-visibility.ts`

Remove org-specific copy from `src/app/dashboard/lib/dashboard-nav-labels.ts`.

## 4. Verify

```bash
pnpm run build
```
