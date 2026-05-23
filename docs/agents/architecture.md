# Architecture & layout

> **Context:** Short rule auto-attaches via `.cursor/rules/architecture.mdc` when editing matching `src/**` paths. This file is the full reference — open only when needed.

## Stack & goal

- **Stack:** Next.js 16+ App Router + `cacheComponents` (enabled in `next.config.ts`), Prisma 7+, Better Auth v1 (organization plugin), shadcn-style UI on Base UI.
- **Goal:** **Generic reusable template** — auth + organization/team dashboard to copy into multiple apps (optional future npm package). Avoid product-specific logic in shared dashboard `lib/`.
- **Schema:** Keep Better Auth baseline; customizations are **additive** only (extra fields/tables).
- **Dashboard navigation:** [dashboard.md](./dashboard.md) — `dashboard-routes.ts`, `dashboard-nav-labels.ts`, breadcrumbs, sidebar.

## Phase 1 scope

Work only on the **`auth`** schema and org/team dashboard flows.

| In scope                                                                            | Out of scope (ignore — no queries, types, UI, routes, or actions) |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Auth, sessions, orgs, teams, members, org/team invitations, dashboard notifications | Prisma **`exam`** schema                                          |
| Join route `/join/[invitationId]` — org/team invitations only                       | Prisma **`better-s3`** / storage tables                           |

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

**Dependency direction (strict):** sub-feature → segment `lib/` → `src/lib` / `src/components`. Never import a sibling feature’s internals (e.g. `members/` must not import from `teams/`). import only for special case and nescessary things that is needed for the feature related to other features or things that is really needed for the feature.

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

### Before adding a component, hook, or utility

1. **Pick scope** — if new and reusable across the segment, put it in segment `lib/` or `components/`; if app-wide, in `src/lib` or `src/components` or highest relevant layer(if already not exists). Don’t duplicate in a sub-feature.
2. **UI first** — compose from existing shadcn primitives in `src/components/ui` before building custom markup or new primitives.
3. Keep additions **minimal** and aligned with nearby conventions.
