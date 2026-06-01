# Removing platform administration

Checklist for forks that do not need **platform** administration. This feature is two layers:

1. **Dashboard UI** — `/dashboard/admin` (users, organizations, ban/unban, role form).
2. **Better Auth [`admin` plugin](https://www.better-auth.com/docs/plugins/admin)** — `user.role`, ban fields, optional impersonation (`Session.impersonatedBy`), and server APIs such as `auth.api.setRole`.

Remove both. Keeping the plugin while deleting only the UI leaves `UserRole` / ban columns and Better Auth admin APIs active without a UI.

**Not org admins:** `MembershipRole.ADMIN` on `Member` is organization membership — unrelated. Do not remove the organization plugin or `MembershipRole`.

Work top to bottom. Finish dashboard and app code (§1–§6), then the auth plugin and database (§7).

## 1. Route and action trees

Delete:

- `src/app/dashboard/admin/` (layout, tabs, users + organizations pages and components)
- `src/app/action/dashboard/admin/` (ban/unban, platform role, `invalidate-admin-cache.ts`)

## 2. Tab registry

| File                                             | Change                                                          |
| ------------------------------------------------ | --------------------------------------------------------------- |
| `src/app/dashboard/admin/lib/admin-slices.ts`    | Delete with the admin tree (slice registry for admin tabs only) |
| `src/app/dashboard/admin/lib/admin-nav-items.ts` | Delete with the admin tree                                      |

Org manage tabs stay in [`src/app/dashboard/lib/dashboard-slices.ts`](../src/app/dashboard/lib/dashboard-slices.ts) — admin is separate.

## 3. SSOT and shared dashboard code

| File                                                  | Change                                                                                                                                                                    |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/dashboard/lib/dashboard-routes.ts`           | Remove `dashboardRouteSegments.admin`, `adminPath`, `adminRoot`, `adminUsers`, `adminOrganizations`                                                                       |
| `src/app/dashboard/lib/cache-tags.ts`                 | Remove `adminUsersPage`, `adminOrganizationsPage`                                                                                                                         |
| `src/app/dashboard/lib/dashboard-nav-labels.ts`       | Remove `sidebar.adminUsers`, `sidebar.adminOrganizations`, `sidebar.groupPlatform`, `adminTabs`, `adminPage`, `adminUserManage`, and `breadcrumbSegments.admin` if unused |
| `src/app/dashboard/lib/dashboard-access.ts`           | Remove `isPlatformAdmin` branches in `canAccessOrganization`, `canManageOrganization`, `canAccessOrganizationTeamView`; delete `requirePlatformAdmin`                     |
| `src/app/dashboard/layout.tsx`                        | Stop loading `isPlatformAdmin`; drop `isPlatformAdmin` from `getDashboardSidebarConfig` input                                                                             |
| `src/app/dashboard/lib/sidebar/get-sidebar-config.ts` | Remove `isPlatformAdmin` from input/types                                                                                                                                 |
| `src/app/dashboard/lib/sidebar/dashboard-items.ts`    | Remove `isPlatformAdmin` from context; delete the “Platform” sidebar group and the `manager \|\| isPlatformAdmin` shortcut for org management                             |

## 4. Org manage coupling

| File                                                                                        | Change                                                                                                                      |
| ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `src/app/dashboard/organizations/[organizationId]/manage/lib/organization-member-guards.ts` | Remove `isPlatformAdmin` import and platform-admin branches in `getActorOrganizationRoleForManage` / `canActorRemoveMember` |

Member actions that use those guards keep working with org roles only.

## 5. Badges (admin-only UI)

Delete if nothing else references them:

- `src/components/badge/platform-role-badge.tsx`
- `src/components/badge/user-account-status-badge.tsx`

Trim:

- `src/lib/badge/badge-labels.ts` — `platformRole`, `userAccountStatus`
- `src/components/badge/badge-config.tsx` — `platformRoleConfig`, `userAccountStatusConfig`, `getPlatformRoleBadgeConfig`, `getUserAccountStatusBadgeConfig`

## 6. App helper

Delete `src/lib/auth/user-role.ts` when nothing imports `isPlatformAdmin`.

Search: `isPlatformAdmin`, `requirePlatformAdmin`, `UserRole`, `adminUsers`, `adminOrganizations`, `auth.api.setRole`, `authClient.admin`.

## 7. Better Auth `admin` plugin and database

Do this **after** §1–§6 so TypeScript no longer references plugin fields.

### 7.1 Server config

Edit [`src/lib/auth/auth.ts`](../src/lib/auth/auth.ts):

- Remove `admin` from the `better-auth/plugins` import.
- Remove the `admin({ defaultRole: "user", adminRoles: ["admin"] })` entry from `plugins` (keep `nextCookies()` and `organization()`).

There is no separate auth client plugin in this template — only the server `auth` instance uses `admin`.

### 7.2 Regenerate CLI schema

```bash
pnpm run auth:generate
```

`auth:generate` overwrites [`prisma/better-auth.prisma`](../prisma/better-auth.prisma). The generated file will no longer include the admin plugin models/fields.

### 7.3 Merge into the shipped schema

Reconcile with [prisma/better-auth-schema-differences.md](../prisma/better-auth-schema-differences.md) and remove template-only admin artifacts:

| Remove from `better-auth.prisma`                                | Notes                                     |
| --------------------------------------------------------------- | ----------------------------------------- |
| `enum UserRole`                                                 | Platform role enum — not `MembershipRole` |
| `User.role`, `User.banned`, `User.banReason`, `User.banExpires` | Added by admin plugin migration           |
| `Session.impersonatedBy`                                        | Impersonation support from admin plugin   |

In your fork you may also trim the “admin plugin” rows in `better-auth-schema-differences.md` and delete [prisma/migrations/20260531230952_add_better_auth_admin_plugin/migration.sql](../prisma/migrations/20260531230952_add_better_auth_admin_plugin/migration.sql) only if you are squashing migrations for a greenfield fork — otherwise add a **new** migration that drops the columns.

### 7.4 Database migration

Example downward migration (adjust if you renamed tables):

```sql
ALTER TABLE "auth"."session" DROP COLUMN IF EXISTS "impersonatedBy";

ALTER TABLE "auth"."user"
  DROP COLUMN IF EXISTS "role",
  DROP COLUMN IF EXISTS "banned",
  DROP COLUMN IF EXISTS "banReason",
  DROP COLUMN IF EXISTS "banExpires";

DROP TYPE IF EXISTS "auth"."user_role";
```

Then:

```bash
pnpm exec prisma migrate dev --name remove_better_auth_admin_plugin
pnpm exec prisma generate
```

Existing `user.role = 'admin'` rows and ban state are discarded when columns drop — back up first if you care about production data.

### 7.5 Docs and env

- [docs/getting-started.md](../docs/getting-started.md) — remove the “Platform admins use the Better Auth **admin** plugin…” paragraph in §2 if you drop this feature.

## 8. Dev seed

- `scripts/seed-dev/run.ts`: remove the `UserRole.admin` update in `assertOwnerExists` (and the `UserRole` import if unused)

## 9. Verify

```bash
pnpm run build
pnpm exec tsc --noEmit
```

Smoke-test: dashboard sidebar, org profile + manage (members/teams) as a non-admin user; confirm no `/dashboard/admin` links remain.
