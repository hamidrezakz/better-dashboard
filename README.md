# Better Dashboard

Reusable **Next.js 16** template: **Better Auth** (organizations + teams), **Prisma 7**, and a modular dashboard you can fork or trim.

**Human overview:** [docs/README.md](./docs/README.md) — what it is, goals, stack, folder layout.  
**AI / agents:** [AGENTS.md](./AGENTS.md) → `.cursor/rules/*.mdc` → [docs/agents/](./docs/agents/).

## Stack

|                 |                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| **Next.js 16**  | App Router, React 19, **`cacheComponents: true`** (tagged cache, `updateTag`)                                |
| **Better Auth** | v1, email/password, **organization plugin** (orgs, teams, members, invitations)                              |
| **Prisma 7**    | PostgreSQL, `auth` schema from Better Auth                                                                   |
| **UI**          | **shadcn/ui** on **Base UI**, default style **`base-mira`** (`components.json`), logical Tailwind, RTL-ready |

## Setup

```bash
pnpm install
cp .env.example .env   # then set DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL, …
pnpm exec prisma generate
pnpm exec prisma db push
pnpm dev
```

Optional:

- `pnpm run seed:dev` — sample orgs, teams, users
- `pnpm run auth:generate` — regenerate `prisma/better-auth.prisma` from `src/lib/auth.ts`

Open [http://localhost:3000](http://localhost:3000).

## Removing features

Fork without teams, invitations, or other slices? See **[removing/README.md](./removing/README.md)** — one guide per feature (`teams.md`, `members.md`, …).

## Conventions

- **Action-first:** `src/app/action/<segment>/` mirrors routes (one file per mutation); `app/api/` = Better Auth + read-only GET only
- **Routes & cache:** `*-routes.ts`, `cache-tags.ts` per app segment (e.g. `src/app/dashboard/lib/`)
- **Nav labels:** `src/app/dashboard/lib/dashboard-nav-labels.ts`
- **Placement & reuse:** [architecture.md § Placement](./docs/agents/architecture.md#placement)
- **Locale:** English by default; `lang` / `dir` from [src/lib/app-locale.ts](./src/lib/app-locale.ts)
- **UI:** compose `src/components/ui/*`; don’t hand-edit generated shadcn files — use the shadcn CLI
