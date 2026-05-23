# Dashboard segment (reusable template)

> **Context:** Rule `.cursor/rules/dashboard.mdc` on `src/app/dashboard/**` and dashboard APIs. Canonical detail here.

Generic Next.js 16 + `cacheComponents` + Better Auth (org) + Prisma + shadcn/Base UI dashboard slice — copy, fork, or CLI scaffold.

## File map

| Piece                                           | Role                                                     |
| ----------------------------------------------- | -------------------------------------------------------- |
| `dashboard-routes.ts`                           | URL builders only                                        |
| `dashboard-nav-labels.ts`                       | Sidebar, breadcrumb segment names, org-manage tab titles |
| `dashboard-items.ts`                            | Role-based sidebar items                                 |
| `dashboard-manage-nav.ts`                       | Org manage tab labels, hrefs, active tab detection       |
| `get-sidebar-config.ts`                         | Cached sidebar data                                      |
| `dashboard-breadcrumb-segments.ts`              | Hidden segments, ID placeholders                         |
| `dashboard-breadcrumbs.tsx`                     | Client trail; entity names via API                       |
| `resolve-breadcrumb-labels.ts` + breadcrumb API | Display names for allowed viewers                        |
| `badge-labels.ts` (`src/lib/`)                  | Enum/badge copy in tables — not route nav                |

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

Keep `dashboard/lib` and `action/dashboard/...` as a copyable tree. Product-only routes belong in the consuming app. Extension points: `dashboard-routes.ts`, `dashboard-nav-labels.ts`, `dashboard-items.ts`, `cache-tags.ts`, mirrored actions.

## Mobile breadcrumbs

On small screens the trail keeps the last two visible segments after hidden ones. `users` / `organizations` are always hidden; `manage` is hidden on mobile only so org manage pages read as **organization name + tab** (see `dashboard-breadcrumb-segments.ts`).

Dedicated back row: per-route metadata next to routes/layouts — document here when added.

## New dashboard route checklist

1. Builder in `dashboard-routes.ts`.
2. `dashboardNavLabels.breadcrumbSegments` if new path segment.
3. Sidebar or manage tab label from `dashboardNavLabels` if applicable.
4. `cache-tags` + `src/app/action/dashboard/...` mirroring the route tree.
5. Breadcrumb entity IDs: `resolve-breadcrumb-labels` policy if needed.
