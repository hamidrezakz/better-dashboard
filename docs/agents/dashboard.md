# Dashboard segment (reusable template)

> **Context:** Open when editing `src/app/dashboard/**`, dashboard APIs, or navigation/copy. This repo is a **generic** Next.js 16 + `cacheComponents` + Better Auth (org plugin) + Prisma + shadcn/Base UI **dashboard template** — copy, fork, or scaffold via a future CLI. It is not tied to a single product.

## What you are maintaining

| Piece                                                                 | Role                                                                                  |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `dashboard-routes.ts`                                                 | URL builders only — no user-visible text                                              |
| `dashboard-nav-labels.ts`                                             | **One file** for sidebar, breadcrumb segment names, and org-manage tab titles         |
| `dashboard-items.ts`                                                  | Role-based sidebar items (uses routes + nav labels)                                   |
| `get-sidebar-config.ts`                                               | Cached sidebar data (memberships, org list)                                           |
| `dashboard-breadcrumb-segments.ts`                                    | Breadcrumb rules (hidden segments, dynamic ID placeholders)                           |
| `dashboard-breadcrumbs.tsx`                                           | Client UI: pathname → trail; fetches entity names via API                             |
| `resolve-breadcrumb-labels.ts` + `/api/dashboard/breadcrumb-label(s)` | Secure display names for user/org IDs                                                 |
| `badge-translations.ts` (`src/lib/i18n/`)                             | Enum/badge copy in tables — **not** route navigation (legacy path; rename in cleanup) |

Feature-specific copy (form titles, empty states, dialog bodies) stays next to that feature unless it is reused across the segment.

## Navigation flow

1. **Links** always come from `dashboardRoutes` (and segment `*-routes.ts` elsewhere).
2. **Sidebar** is built server-side from session + DB (`getDashboardSidebarConfig` → `getDashboardSidebarItems`).
3. **Breadcrumbs** derive from the URL; static segment text comes from `dashboardNavLabels.breadcrumbSegments`; dynamic segments resolve names when the viewer is allowed.
4. **Org manage** uses horizontal tabs (`manage-tabs-nav.tsx`) — tab labels come from `dashboardNavLabels.manageTabs`, hrefs from `dashboardRoutes`.

Do not duplicate nav/tab/breadcrumb strings in components — add or change keys in `dashboard-nav-labels.ts`.

## Copy (single language)

- **English** now; strings in `dashboard-nav-labels.ts` (and `badge-translations.ts` for enums). No i18n runtime in the template.
- File layout is intentional so a later language swap or multilingual setup is straightforward — that is not agent work unless requested.
- Another single language (e.g. Persian): edit copy files + root `lang`/`dir`. Styling: [ui-design.md](./ui-design.md).
- **Trimming optional features:** delete whole subtrees (routes + actions + nav keys).

## Forking / package / CLI later

- Keep **segment boundaries** (`dashboard/lib`, `action/dashboard/...`) so the dashboard can be copied as a tree or published as a package later.
- Avoid product-specific naming in shared `lib/` files; product-only routes belong in the consuming app, not in the template core.
- Extension points for generators: `dashboard-routes.ts`, `dashboard-nav-labels.ts`, `dashboard-items.ts`, `cache-tags.ts`, and mirrored `action/dashboard/**` paths.

## Mobile header (future)

Breadcrumbs already shorten on mobile (last two visible nodes). For a dedicated back row (“one title + back”), add per-route metadata (e.g. `parentHref` + `title`) alongside `dashboard-routes` or in segment layouts — do not scatter one-off titles in page components. Document new routes in this file when that metadata exists.

## Agent checklist for a new dashboard route

1. Add builder to `dashboard-routes.ts`.
2. Add segment label to `dashboardNavLabels.breadcrumbSegments` if the path introduces a new segment.
3. If the route appears in sidebar or manage tabs, wire the label from `dashboardNavLabels` there too.
4. Register `cache-tags` and actions under `src/app/action/dashboard/...` mirroring the route tree.
5. If breadcrumbs show an entity ID, ensure `resolve-breadcrumb-labels` policy covers it.
