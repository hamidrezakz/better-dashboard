# Dashboard segment

> **Context:** Rule `.cursor/rules/dashboard.mdc` on `src/app/dashboard/**` and dashboard APIs. Canonical detail here.

Copyable org/team dashboard slice — fork, trim route trees, or CLI scaffold. Placement rules: [architecture.md § Placement](./architecture.md#placement).

## Segment SSOT (`dashboard/lib/`)

| File                      | Role                                    |
| ------------------------- | --------------------------------------- |
| `dashboard-routes.ts`     | All dashboard URLs — no hardcoded paths |
| `dashboard-nav-labels.ts` | Sidebar, breadcrumbs, manage tabs (just global things)       |
| `cache-tags.ts`           | Tag builders for reads/writes           |
| `dashboard-access.ts`     | Access guards                           |

Badge enum copy: `src/lib/badge-labels.ts` (not route nav).

## Segment `components/`

Shared chrome and shells — hoist here when **two or more** dashboard areas need the same UI:

| Area                   | Path                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| Form shell             | `components/form-shell/` (`DashboardFormShell`, footer actions)                                   |
| Page shell             | `components/dashboard-page-shell/`                                                                |
| Sidebar                | `components/sidebar/` (+ `dashboard-sidebar-close-on-navigate.tsx` — not `components/ui/sidebar`) |
| Breadcrumbs            | `components/breadcrumbs/`                                                                         |
| Notifications (chrome) | `components/notifications/`                                                                       |

**Middle tier:** `organizations/[organizationId]/manage/components/` when shared only within org-manage (e.g. `OrganizationMembersMultiCombobox`).

**Stay local:** feature forms, panels, row menus, field components beside that route (e.g. `(user)/account/components/`). Feature copy (empty states, dialogs) stays local unless reused across the segment.

Route-scoped notification pages: `(user)/notifications`, `organizations/.../manage/notifications`.

## Navigation flow

1. **Links** — `dashboardRoutes` (and other segment `*-routes.ts`).
2. **Sidebar** — session + DB → `getDashboardSidebarConfig` → items.
3. **Breadcrumbs** — URL + `dashboardNavLabels.breadcrumbSegments`; dynamic IDs via resolver when allowed.
4. **Org manage tabs** — labels from `dashboardNavLabels.manageTabs`, hrefs from `dashboardRoutes`.

Do not duplicate nav/tab/breadcrumb strings in components.

## Tables (variable DB text)

Do **not** change table layout globally unless the user asks.

Long DB-backed cell text (email, title, body, names):

- **`truncate`** on the text node (`<span>` / `<p>`), with **`block`** or **`max-w-*`** on that node.
- Tune **`max-w-*` per field** (e.g. email `max-w-md`, titles `max-w-xs sm:max-w-sm`).
- **`title={fullValue}`** when truncation hides meaning.
- Badges, counts, dates, action menus: leave as-is unless they overflow.

Reuse `DashboardTableShell` from `src/components/dashboard-table/` for paginated lists.

## Forms & feedback

**Toasts:** `toast.success` / `toast.error` from `sonner` at the call site — no wrapper module. `<Toaster />` in root layout.

**Field validation:** errors after blur or submit attempt; `aria-invalid` / `aria-describedby`. Server errors → toast unless dialog stays open with inline copy.

**Form shell footers:** `DashboardFormShellFooterActions` in `components/form-shell/`. DOM order: **Cancel** (outline) then **primary**; mobile uses `flex-col-reverse` so primary is on top. `variant="destructive"` only for destructive actions, not Cancel.

## Copy & locale

- English in template; no i18n runtime unless requested.
- Chrome copy in `dashboard-nav-labels.ts` only. (just global dashboard labels that really needed to be. not one placeables...)
- Other language: edit copy files + `src/lib/app-locale.ts` — [ui-design.md](./ui-design.md).

## Mobile breadcrumbs

Last two segments visible after hidden ones. `users` / `organizations` always hidden; `manage` hidden on mobile only (org name + tab). See `lib/breadcrumbs/dashboard-breadcrumb-segments.ts`.

## Fork / CLI

Keep `dashboard/lib` + `action/dashboard/...` as one tree. Trim: delete route subtree, matching actions, and unused keys in `dashboard-nav-labels` / `lib/sidebar/dashboard-items.ts`. Product-only routes belong in the consuming app.

## New dashboard route checklist

1. Builder in `dashboard-routes.ts`.
2. `dashboardNavLabels.breadcrumbSegments` if new path segment.
3. Sidebar or manage tab label from `dashboardNavLabels` if applicable.
4. `cache-tags` + `src/app/action/dashboard/...` mirroring the route tree.
5. Breadcrumb entity IDs: `resolve-breadcrumb-labels` policy if needed.
