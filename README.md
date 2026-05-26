# Better Dashboard

Reusable **Next.js 16** template: **Better Auth** (organizations + teams), **Prisma 7**, and a **mobile-first** modular dashboard—sheet sidebar, touch-friendly forms, responsive chrome—built to feel great on phones. Fork or trim as needed.

**Getting started:** [docs/getting-started.md](./docs/getting-started.md) — clone, env, database, run, trim features.  
**Overview:** [docs/README.md](./docs/README.md) — goals, stack, folder layout.  
**AI / agents:** [AGENTS.md](./AGENTS.md) → `.cursor/rules/*.mdc` → [docs/agents/](./docs/agents/).

## Stack

|                 |                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| **Next.js 16**  | App Router, React 19, **`cacheComponents: true`** (tagged cache, `updateTag`)                                |
| **Better Auth** | v1, email/password, **organization plugin** (orgs, teams, members, invitations)                              |
| **Prisma 7**    | PostgreSQL, `auth` schema from Better Auth                                                                   |
| **UI**          | **shadcn/ui** on **Base UI**, default style **`base-mira`** (`components.json`), logical Tailwind, RTL-ready |

## Removing features

Fork without teams, invitations, or other slices? See **[removing/README.md](./removing/README.md)** — one guide per feature (`teams.md`, `members.md`, …). Do this early; see [getting-started § Trim features](./docs/getting-started.md#6-trim-features-you-do-not-need).

## Conventions

- **Action-first:** `src/app/action/<segment>/` mirrors routes (one file per mutation); `app/api/` = Better Auth + read-only GET only
- **Routes & cache:** `*-routes.ts`, `cache-tags.ts` per app segment (e.g. `src/app/dashboard/lib/`)
- **Nav labels:** `src/app/dashboard/lib/dashboard-nav-labels.ts`
- **Placement & reuse:** [architecture.md § Placement](./docs/agents/architecture.md#placement)
- **Locale:** English by default; `lang` / `dir` from [src/lib/app-locale.ts](./src/lib/app-locale.ts)
- **UI:** compose `src/components/ui/*`; don’t hand-edit generated shadcn files — use the shadcn CLI

More: [getting-started § Next steps](./docs/getting-started.md#9-next-steps).
