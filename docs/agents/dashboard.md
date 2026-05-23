# Dashboard segment (reusable template)

> **Context:** Rule `.cursor/rules/dashboard.mdc` on `src/app/dashboard/**` and dashboard APIs. Canonical detail here.

Generic Next.js 16 + `cacheComponents` + Better Auth (org) + Prisma + shadcn/Base UI dashboard slice — copy, fork, or CLI scaffold.

## File map

**Segment SSOT (stay at `dashboard/lib/` root):** `dashboard-routes.ts`, `dashboard-nav-labels.ts`, `cache-tags.ts`, `dashboard-access.ts`.

| Area                   | Path                                                | Role                                                                                                                                                                    |
| ---------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sidebar                | `lib/sidebar/*`, `components/sidebar/*`             | Items, config, manage tabs, app sidebar, nav, org switcher; `dashboard-sidebar-close-on-navigate.tsx` closes mobile sheet on route change (not `components/ui/sidebar`) |
| Breadcrumbs            | `lib/breadcrumbs/*`, `components/breadcrumbs/*`     | Segment rules, resolver, client trail + breadcrumb API                                                                                                                  |
| Notifications (chrome) | `lib/notifications/*`, `components/notifications/*` | Header dropdown, shared view dialog, visibility/types                                                                                                                   |
| Layout shell           | `components/shell/*`                                | Page shell, header, layout/page fallbacks                                                                                                                               |
| Badges                 | `badge-labels.ts` (`src/lib/`)                      | Enum/badge copy in tables — not route nav                                                                                                                               |

Route-scoped notification UI stays under `(user)/notifications` and `organizations/.../manage/notifications`.

Feature-specific copy (forms, empty states, dialogs) stays beside that feature unless reused across the segment.

## Navigation flow

1. **Links** from `dashboardRoutes` (and other segment `*-routes.ts`).
2. **Sidebar** server-side: session + DB → `getDashboardSidebarConfig` → items.
3. **Breadcrumbs** from URL; static text from `dashboardNavLabels.breadcrumbSegments`; dynamic IDs via resolver when allowed.
4. **Org manage tabs:** labels from `dashboardNavLabels.manageTabs`, hrefs from `dashboardRoutes`.

Do not duplicate nav/tab/breadcrumb strings in components.

## Copy

- English; strings in `dashboard-nav-labels.ts` and badge map. No i18n runtime in template.
- Another language: edit copy files + `src/lib/app-locale.ts` (and matching font if needed) — [ui-design.md](./ui-design.md).
- **Trim feature:** delete subtree (routes + actions + nav keys).

## Fork / CLI

Keep `dashboard/lib` and `action/dashboard/...` as a copyable tree. Product-only routes belong in the consuming app. Extension points: root `dashboard-routes.ts`, `dashboard-nav-labels.ts`, `cache-tags.ts`, plus `lib/sidebar/dashboard-items.ts` when trimming nav. Optional slices: delete matching `lib/<area>/`, `components/<area>/`, route subtrees, and actions together.

## Mobile breadcrumbs

On small screens the trail keeps the last two visible segments after hidden ones. `users` / `organizations` are always hidden; `manage` is hidden on mobile only so org manage pages read as **organization name + tab** (see `lib/breadcrumbs/dashboard-breadcrumb-segments.ts`).

Dedicated back row: per-route metadata next to routes/layouts — document here when added.

## New dashboard route checklist

1. Builder in `dashboard-routes.ts`.
2. `dashboardNavLabels.breadcrumbSegments` if new path segment.
3. Sidebar or manage tab label from `dashboardNavLabels` if applicable.
4. `cache-tags` + `src/app/action/dashboard/...` mirroring the route tree.
5. Breadcrumb entity IDs: `resolve-breadcrumb-labels` policy if needed.
