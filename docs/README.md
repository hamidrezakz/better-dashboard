# Project overview

Minimal guide for humans. For AI agents, use [AGENTS.md](../AGENTS.md) and [docs/agents/](./agents/).

## What this is

**Better Dashboard** is a reusable Next.js starter: sign-in, organizations, teams, members, invitations, and a full dashboard UI. You can fork it, trim features you do not need, or later inject optional slices via CLI.

The database layer is limited to **Better Auth’s `auth` schema** in core — no separate product domain models in the template. Add your own Prisma models in the app that consumes this template.

## Why it exists

| Goal                                       | How                                                                                          |
| ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Ship auth + multi-tenant dashboard quickly | Better Auth with the **organization** plugin (teams enabled)                                 |
| Stay fork-friendly                         | Each feature is a removable route + action subtree                                           |
| Modern Next.js patterns                    | App Router, Server Components, **action-first** (`app/action/` mirrors routes), tagged cache |
| Consistent UI                              | shadcn/ui on **Base UI**, preset **base-mira** by default, logical Tailwind (RTL-ready)                 |

## Stack

| Layer     | Choice                                                                           |
| --------- | -------------------------------------------------------------------------------- |
| Framework | **Next.js 16** (App Router), `cacheComponents: true` in `next.config.ts`         |
| UI        | **shadcn/ui** v4, style **`base-mira`**, **Base UI** primitives, Lucide icons    |
| Auth      | **Better Auth** v1 + **organization** plugin (orgs, teams, members, invitations) |
| Data      | **Prisma 7** + PostgreSQL (`auth` schema from Better Auth)                       |
| Language  | TypeScript, React 19                                                             |

Caching in this repo uses Next’s **tagged cache** (`use cache`, `cacheTag`, `updateTag`) — not the older mental model from Next 13/14 alone.

## Repository layout

```
src/
  app/
    action/<segment>/    # mirrors routes; one mutation per file (auth, dashboard, join)
    api/                 # Better Auth handler + read-only GET
    dashboard/
      lib/               # Routes, nav labels, cache tags, access
      components/        # Shared dashboard chrome (sidebar, form shell, …)
    (auth)/              # Sign-in / sign-up pages
    join/                # Invitation accept flow
  components/            # App-wide UI (outside shadcn ui/)
    ui/                  # shadcn primitives — regenerate via CLI, don’t hand-edit
  lib/                   # auth, prisma, auth-session, locale, badges
prisma/                  # Better Auth schema (+ your migrations when you extend)
docs/
  README.md              # This file (humans)
  agents/                # Deep rules for AI (Read when needed)
```

**Dependency idea:** feature code colocates beside its route; shared pieces move up to `dashboard/components/`, then `src/components/`, only when reused. See [agents/architecture.md § Placement](./agents/architecture.md#placement).

## What’s included

- Email/password auth, sessions, account settings
- Organizations with manage area: members, teams, invitations, notifications
- User-scoped notifications and profile
- Sidebar, breadcrumbs, org switcher, responsive layout
- Dev seed script (`pnpm run seed:dev`)

## What’s not included

- Billing, analytics, or product-specific domains
- i18n runtime (English copy in `lib/` files; locale hook is `src/lib/app-locale.ts`)
- Hosted deploy config (bring your own)

## Next steps

- **Run locally:** [README.md](../README.md) setup section
- **Change UI primitives:** `pnpm dlx shadcn@latest add …` (preset `base-mira` in `components.json`)
- **Regenerate auth schema:** `pnpm run auth:generate`
- **Coding conventions:** [README.md § Conventions](../README.md#conventions)
