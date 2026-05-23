# Architecture & layout

> **Context:** Short rule auto-attaches via `.cursor/rules/architecture.mdc` when editing matching `src/**` paths. This file is the full reference — open only when needed.

## Stack & goal

- **Stack:** Next.js 16+ App Router + `cacheComponents` (enabled in `next.config.ts`), Prisma 7+, Better Auth v1 (organization plugin), shadcn-style UI on Base UI.
- **Goal:** **Generic reusable template** — auth + organization/team dashboard to copy into new apps or extend via a future CLI that injects optional feature slices into the same paths.
- **Schema:** Better Auth baseline in Prisma; customizations are **additive** only (extra fields/tables). This template does **not** ship product-specific domains (storage, exams, etc.) in core dashboard code.
- **Dashboard navigation:** [dashboard.md](./dashboard.md) — `dashboard-routes.ts`, `dashboard-nav-labels.ts`, breadcrumbs, sidebar.

## Template scope (data & features)

| In scope                                                                                         | Out of scope in template core                                          |
| ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| Auth, sessions, orgs, teams, members, org/team invitations, dashboard notifications (if present) | Product-only Prisma models and UI not part of the auth/dashboard slice |
| Join route `/join/[invitationId]` — org/team invitations only                                    | Wiring legacy schemas from other apps into shared `dashboard/lib`      |

Optional dashboard features (e.g. teams, notifications) live in **dedicated subtrees**. Removing a feature means deleting its route tree, `action/dashboard/...` mirror, and unused keys in `dashboard-nav-labels` / `dashboard-items` — not patching scattered helpers.

## CLI-ready modularity (future)

The repo is structured so a generator can:

1. **Copy or merge** a feature folder (`src/app/dashboard/<entity>/...` + matching `src/app/action/dashboard/...`).
2. **Register** routes in `dashboard-routes.ts`, labels in `dashboard-nav-labels.ts`, and tags in `cache-tags.ts` via documented extension points.
3. **Avoid** cross-imports between sibling features so injected code does not pull unrelated modules.

Agents should preserve that separability when adding or removing features.

## Modular layout (features must stay separable)

Organize so a slice (e.g. **teams**, **invitations**, **join**) can be moved or deleted with minimal coupling.

```
src/
  lib/                          # app-wide: auth, prisma, auth-session
  components/                   # app-wide UI + globals-badge
  app/
    action/<feature>/           # one mutation per file; mirrors routes
    <feature>/                  # e.g. dashboard, join, (auth)
      lib/                      # segment-wide: *-routes.ts, cache-tags.ts, access helpers
      components/               # segment shell only (sidebar, header)
      <entity>/[id]/            # route tree
        <sub-feature>/          # e.g. manage/members, manage/teams
          page.tsx
          components/           # only this sub-feature
          lib/                  # only this sub-feature
```

**Dependency direction (strict):** sub-feature → segment `lib/` → `src/lib` / `src/components`. Do not import a sibling feature’s internals (e.g. `members/` must not import from `teams/`). Cross-feature imports only when unavoidable and limited to segment-level contracts (routes, tags, access helpers).

**Per slice, colocate:** page(s), UI, feature `lib/`, and matching actions under `src/app/action/<feature>/`.

**Segment `lib/` examples:** `dashboard/lib/cache-tags.ts`, `dashboard/lib/dashboard-routes.ts`, `join/lib/cache-tags.ts`.

## Shared standards (single source of truth)

If something is standard for a scope, define it **once** at the highest relevant layer; lower layers **consume**, don’t reimplement.

| Scope               | Location                                    | Examples                                                                |
| ------------------- | ------------------------------------------- | ----------------------------------------------------------------------- |
| Whole app           | `src/lib/`, `src/components/`               | `auth-session.ts`, `components/ui/*`, `globals-badge/*`                 |
| App segment         | `src/app/<segment>/lib/`, `.../components/` | `dashboard-routes`, `dashboard-nav-labels`, `cache-tags`, sidebar shell |
| Route / sub-feature | beside that route                           | invitation labels, table columns, form utils                            |

- **Routes:** `*-routes.ts` builders — no hardcoded path strings in pages or actions.
- **Cache tags:** `cache-tags.ts` per segment — no hardcoded tag strings.
- **Badges:** labels in shared config; thin domain wrappers (`role`, `visibility`, invite/request status).
- **UI:** reuse `src/components/ui` (shadcn/Base UI); Base UI triggers use `render={<Link … />}`, not `asChild`.
- **UI styling:** [ui-design.md](./ui-design.md)

### Before adding a component, hook, or utility

1. **Pick scope** — if new and reusable across the segment, put it in segment `lib/` or `components/`; if app-wide, in `src/lib` or `src/components`. Don’t duplicate in a sub-feature.
2. **UI first** — shadcn in `src/components/ui`, default styling; compose before custom markup ([ui-design.md](./ui-design.md)).
3. Keep additions **minimal** and aligned with nearby conventions.
