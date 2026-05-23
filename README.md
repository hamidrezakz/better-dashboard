# Better Dashboard

Reusable Next.js template: Better Auth (orgs/teams), Prisma (`auth` schema), modular dashboard under `src/app/dashboard/`.

**Stack:** Next.js 16+ (`cacheComponents`), Better Auth, Prisma 7, PostgreSQL, shadcn/Base UI.

## Setup

```bash
pnpm install
# configure .env (database, auth secrets)
pnpm exec prisma generate
pnpm exec prisma db push
pnpm dev
```

Optional: `pnpm run seed:dev` · `pnpm run auth:generate` (regenerate `prisma/better-auth.prisma`)

## Conventions

- Actions: `src/app/action/<feature>/` (one file per mutation)
- Routes & cache: `*-routes.ts`, `cache-tags.ts` per segment
- Nav labels: `src/app/dashboard/lib/dashboard-nav-labels.ts`
- Agents: [AGENTS.md](./AGENTS.md) (always) → `.cursor/rules/*.mdc` (globs) → [docs/agents/](./docs/agents/) (Read for detail)

English; copy in segment `lib/` files. Default `lang`/`dir`: [src/lib/app-locale.ts](./src/lib/app-locale.ts). UI: logical spacing + shadcn defaults ([ui-design.md](./docs/agents/ui-design.md)).
