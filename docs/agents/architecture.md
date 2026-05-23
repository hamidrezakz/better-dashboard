# Architecture & layout

> **Context:** Rule `.cursor/rules/architecture.mdc` on `src/app`, `src/lib`, `src/components`. Canonical detail here.

## Stack & goal

- **Stack:** Next.js 16+ App Router + `cacheComponents`, Prisma 7+, Better Auth v1 (organization plugin), shadcn/Base UI.
- **Goal:** Generic reusable template — auth + org/team dashboard; future CLI injects optional slices into the same paths.
- **Schema:** Better Auth baseline in Prisma; customizations additive only. No product-specific domains in core dashboard code.
- **Navigation:** [dashboard.md](./dashboard.md).

## Template scope

| In scope                                                                                | Out of scope in core                               |
| --------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Auth, sessions, orgs, teams, members, invitations, dashboard notifications (if present) | Product-only Prisma/UI not in auth dashboard slice |
| `/join/[invitationId]` (org/team invitations)                                           | Legacy schemas wired into shared `dashboard/lib`   |

Optional features live in dedicated subtrees. Removing one: delete route tree, matching `action/dashboard/...`, and unused keys in `dashboard-nav-labels` / `dashboard-items`.

## CLI-ready modularity

A generator should be able to:

1. Copy/merge `src/app/dashboard/<entity>/...` + `src/app/action/dashboard/...`.
2. Register `dashboard-routes.ts`, `dashboard-nav-labels.ts`, `cache-tags.ts`.
3. Avoid cross-imports between sibling features.

## Layout tree

```
src/
  lib/                    # auth, prisma, auth-session
  components/             # app-wide UI, globals-badge
  app/
    action/<feature>/     # one mutation per file
    <feature>/            # dashboard, join, auth, …
      lib/                # *-routes.ts, cache-tags.ts, access
      components/         # segment shell
      <entity>/[id]/
        <sub-feature>/
          page.tsx
          components/
          lib/
```

**Dependency direction:** sub-feature → segment `lib/` → `src/lib` / `src/components`. No sibling feature internals (e.g. `members/` → not `teams/`). Cross-feature only via segment contracts (routes, tags, access).

## Shared standards (SSOT)

| Scope       | Location                      | Examples                                                 |
| ----------- | ----------------------------- | -------------------------------------------------------- |
| App         | `src/lib/`, `src/components/` | `auth-session.ts`, `components/ui/*`, badges             |
| Segment     | `src/app/<segment>/lib/`      | `dashboard-routes`, `dashboard-nav-labels`, `cache-tags` |
| Sub-feature | beside route                  | columns, form utils, invitation copy                     |

- **Routes:** `*-routes.ts` — no hardcoded paths in pages/actions.
- **Cache tags:** `cache-tags.ts` per segment.
- **Badges:** shared config + thin wrappers.
- **UI:** [ui-design.md](./ui-design.md).

### Before adding code

1. Pick scope — segment-wide goes in segment `lib/` / `components/`, not buried in one sub-feature.
2. Compose shadcn primitives first.
3. Stay minimal; match nearby conventions.
