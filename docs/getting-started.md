# Getting started

Linear checklist for forking this template: clone → env → database → run → trim → optional cleanup.

**Overview:** [README.md](./README.md) — what the template includes and how it is organized.

---

## 1. Prerequisites

| Tool           | Version / notes                                       |
| -------------- | ----------------------------------------------------- |
| **Node.js**    | 22 (matches [CI](../.github/workflows/ci.yml))        |
| **pnpm**       | 9                                                     |
| **PostgreSQL** | Empty database; you will set `DATABASE_URL` in `.env` |

---

## 2. Install

```bash
git clone <your-fork-url>
cd better-dashboard
pnpm install
cp .env.example .env
```

Edit `.env`:

| Variable                      | Required | Purpose                                             |
| ----------------------------- | -------- | --------------------------------------------------- |
| `DATABASE_URL`                | Yes      | PostgreSQL connection string                        |
| `BETTER_AUTH_SECRET`          | Yes      | Long random secret for sessions                     |
| `BETTER_AUTH_URL`             | Yes      | Server auth base URL (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Yes      | Client auth base URL (same in local dev)            |
| `NEXT_PUBLIC_URL`             | No       | Public site URL for absolute links                  |

Platform admins use the Better Auth **admin** plugin: set `user.role` to `admin` in the database (dev seed promotes the owner user) or call `authClient.admin.setRole` / `auth.api.setRole`.

---

## 3. Database (PostgreSQL + `auth` schema)

This template uses **PostgreSQL** with all auth tables in a dedicated **`auth`** schema (`schemas = ["auth"]` in [`prisma/schema.prisma`](../prisma/schema.prisma)). That differs from the default Better Auth CLI output, which targets an implicit `public` layout.

Shipped migrations create the `auth` schema and tables (see [`prisma/migrations/`](../prisma/migrations/)).

**Before changing auth or the Prisma schema**, read [prisma/better-auth-schema-differences.md](../prisma/better-auth-schema-differences.md). Main deltas from the default Better Auth schema:

- `@@schema("auth")` on every model
- `@default(cuid())` primary keys
- `MembershipRole` enum instead of a string `Member.role`
- Shareable **link** invitations (not email invites)
- `Notification` model and related enums

Apply the schema:

```bash
pnpm exec prisma generate
pnpm exec prisma migrate deploy
```

For day-to-day schema changes during development, use `pnpm exec prisma migrate dev` instead of `deploy`.

`pnpm exec prisma db push` is fine for throwaway local experiments; prefer **migrate** when you care about migration history (production, CI, team forks).

---

## 4. Run the app

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and **sign up** your first user via [`src/app/(auth)/`](<../src/app/(auth)/>).

---

## 5. Optional dev seed

[`scripts/seed-dev/`](../scripts/seed-dev/) adds sample orgs, teams, members, invitations, and notifications.

1. Sign up first.
2. Set `OWNER_USER_ID` in [`scripts/seed-dev/config.ts`](../scripts/seed-dev/config.ts) to your user id.
3. Run:

```bash
pnpm run seed:dev
```

Clear seeded rows: `pnpm run seed:dev:clear`.

If you remove teams, invitations, or notifications, delete or trim the matching files under `scripts/seed-dev/data/` (see [removing guides](../removing/README.md)).

---

## 6. Trim features you do not need

Do this **before** heavy customization so you delete less code.

1. Decide which slices you do not need (platform admin, teams, members, invitations, org/user notifications).
2. Remove the tab from [`src/app/dashboard/lib/dashboard-slices.ts`](../src/app/dashboard/lib/dashboard-slices.ts).
3. Follow the matching guide in [removing/README.md](../removing/README.md) top to bottom.
4. Run `pnpm run build` after each guide.

---

## 7. Scripts

| Script                        | Purpose                                                                                       | Remove if…                                          |
| ----------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `dev` / `build` / `start`     | Run the app                                                                                   | Never                                               |
| `lint` / `typecheck`          | CI-quality checks                                                                             | Keep if you use CI                                  |
| `seed:dev` / `seed:dev:clear` | Dev database fixtures                                                                         | You do not seed locally                             |
| `auth:generate`               | Regenerate `prisma/better-auth.prisma` from [`src/lib/auth/auth.ts`](../src/lib/auth/auth.ts) | You freeze the schema and never upgrade Better Auth |

`auth:generate` **overwrites** `prisma/better-auth.prisma`. After running it, merge changes using [prisma/better-auth-schema-differences.md](../prisma/better-auth-schema-differences.md), then `pnpm exec prisma generate` (and migrate when the database should change).

---

## 8. Optional folders to remove

Safe to delete from your fork when you no longer need them:

| Path                                                                                                                                                                            | Safe when                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [`removing/`](../removing/)                                                                                                                                                     | You finished all trim guides                |
| [`prisma/default-better-auth-schima.txt`](../prisma/default-better-auth-schima.txt) + [`prisma/better-auth-schema-differences.md`](../prisma/better-auth-schema-differences.md) | You will not merge Better Auth CLI upgrades |
| [`scripts/seed-dev/`](../scripts/seed-dev/) and `seed:*` scripts in `package.json`                                                                                              | No dev seeding                              |
| [`.cursor/`](../.cursor/), [`AGENTS.md`](../AGENTS.md), [`docs/agents/`](./agents/)                                                                                             | No Cursor / agent workflow                  |
| [`.cursor/plans/`](../.cursor/plans/)                                                                                                                                           | Internal agent plans only                   |

---

## 9. Next steps

- **Product overview:** [docs/README.md](./README.md)
- **Extend the database:** add models in `prisma/` and run migrate; keep Better Auth models in `better-auth.prisma`
- **UI components:** `pnpm dlx shadcn@latest add …` (preset `base-mira` in [`components.json`](../components.json))
- **Coding conventions:** [README.md § Conventions](../README.md#conventions), [architecture § Placement](./agents/architecture.md#placement)
