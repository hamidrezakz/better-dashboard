# Dashboard segment (reusable template)

> **Context:** Open when editing `src/app/dashboard/**`, dashboard APIs, or navigation/copy. This repo is a **generic** Next.js 16 + `cacheComponents` + Better Auth (org plugin) + Prisma + shadcn/Base UI **dashboard template** — copy or extract into other projects. It is not tied to a single product name.

## What you are maintaining

| Piece                                                                 | Role                                                                          |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `dashboard-routes.ts`                                                 | URL builders only — no user-visible text                                      |
| `dashboard-nav-labels.ts`                                             | **One file** for sidebar, breadcrumb segment names, and org-manage tab titles |
| `dashboard-items.ts`                                                  | Role-based sidebar items (uses routes + nav labels)                           |
| `get-sidebar-config.ts`                                               | Cached sidebar data (memberships, org list)                                   |
| `dashboard-breadcrumb-segments.ts`                                    | Breadcrumb rules (hidden segments, dynamic ID placeholders)                   |
| `dashboard-breadcrumbs.tsx`                                           | Client UI: pathname → trail; fetches entity names via API                     |
| `resolve-breadcrumb-labels.ts` + `/api/dashboard/breadcrumb-label(s)` | Secure display names for user/org IDs                                         |
| `badge-translations.ts` (`src/lib/i18n/`)                             | Enum/badge copy in tables — **separate** from route navigation                |

Feature-specific copy (form titles, empty states, dialog bodies) stays next to that feature unless it is reused across the segment.

## Navigation flow

1. **Links** always come from `dashboardRoutes` (and segment `*-routes.ts` elsewhere).
2. **Sidebar** is built server-side from session + DB (`getDashboardSidebarConfig` → `getDashboardSidebarItems`).
3. **Breadcrumbs** derive from the URL; static segment text comes from `dashboardNavLabels.breadcrumbSegments`; dynamic segments resolve names when the viewer is allowed.
4. **Org manage** uses horizontal tabs (`manage-tabs-nav.tsx`) — tab labels come from `dashboardNavLabels.manageTabs`, hrefs from `dashboardRoutes`.

Do not duplicate nav/tab/breadcrumb strings in components — add or change keys in `dashboard-nav-labels.ts`.

## Copy & locale (no bilingual stack)

- **Single language per deployment.** The sample template uses Persian strings and RTL (`lang="fa-IR"` `dir="rtl"` in the root layout). There is **no** `next-intl`, message catalogs, or locale switching.
- **Switching to English (or another language):** replace strings in `dashboard-nav-labels.ts`, `badge-translations.ts`, and feature-local copy; adjust `lang` / `dir` on the root layout. No framework migration required.
- **Trimming for a slimmer fork:** delete optional features (e.g. teams, notifications UI) and their routes/actions; remove unused keys from `dashboard-nav-labels` and entries from `dashboard-items` / `dashboard-routes`. Prefer deleting whole sub-features over leaving dead helpers.

## Forking / “library later”

- Keep **segment boundaries** (`dashboard/lib`, `action/dashboard/...`) so the dashboard can be copied as a tree or published as a package later.
- Avoid product-specific naming in shared `lib/` files; product-only routes belong in the consuming app, not in the template core.
- Optional Prisma schemas in this monorepo (`exam`, `better-s3`) are **out of scope** for the dashboard template — do not wire them into dashboard code when reusing.

## Mobile header (future)

Breadcrumbs already shorten on mobile (last two visible nodes). For a dedicated back row (“one title + back”), add per-route metadata (e.g. `parentHref` + `title`) alongside `dashboard-routes` or in segment layouts — do not scatter one-off titles in page components. Document new routes in this file when that metadata exists.

## Agent checklist for a new dashboard route

1. Add builder to `dashboard-routes.ts`.
2. Add segment label to `dashboardNavLabels.breadcrumbSegments` if the path introduces a new segment.
3. If the route appears in sidebar or manage tabs, wire the label from `dashboardNavLabels` there too.
4. Register `cache-tags` and actions under `src/app/action/dashboard/...` mirroring the route tree.
5. If breadcrumbs show an entity ID, ensure `resolve-breadcrumb-labels` policy covers it.
