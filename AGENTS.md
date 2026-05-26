---
description: Reusable auth + dashboard template — agent index; open detail only when needed
alwaysApply: true
---

# Agent guide (index)

**Always injected.** Index only — not the full spec.

## Workflow

1. Files you touch → matching [.cursor/rules/\*.mdc](.cursor/rules/) applies (constraints only).
2. Unsure → **Read** one [docs/agents/](docs/agents/) file (table below). Do not assume layer 3 without opening it.
3. **Before a new file or component:** search upward; default inline — [architecture.md § Placement](docs/agents/architecture.md#placement).
4. **Next.js APIs:** in-repo docs only — **no web search** — [nextjs.md](docs/agents/nextjs.md).

## Context layers

| Layer | When                          | Source                                                      |
| ----- | ----------------------------- | ----------------------------------------------------------- |
| **1** | Every chat                    | This file                                                   |
| **2** | Files you touch match `globs` | [.cursor/rules/\*.mdc](.cursor/rules/)                      |
| **3** | Layer 2 is not enough         | [docs/agents/](docs/agents/) — **Read** for that topic only |

## Project

Next.js 16+ (`cacheComponents`), Prisma 7+, Better Auth v1 (org plugin), shadcn/Base UI — reusable auth + org/team dashboard template (**action-first**). Better Auth `auth` schema only in core; no product Prisma domains in dashboard core.

## Layer 2 → deep doc

| Rule                                                   | Globs (summary)                                          | Read for detail                                    |
| ------------------------------------------------------ | -------------------------------------------------------- | -------------------------------------------------- |
| [architecture.mdc](.cursor/rules/architecture.mdc)     | `src/app/**`, `src/lib/**`, `src/components/**`          | [architecture.md](docs/agents/architecture.md)     |
| [dashboard.mdc](.cursor/rules/dashboard.mdc)           | `src/app/dashboard/**`, `src/app/api/dashboard/**`       | [dashboard.md](docs/agents/dashboard.md)           |
| [implementation.mdc](.cursor/rules/implementation.mdc) | `action/**`, `auth-session.ts`, `page.tsx`, `layout.tsx` | [implementation.md](docs/agents/implementation.md) |
| [caching.mdc](.cursor/rules/caching.mdc)               | `action/**`, `cache-tags.ts`, `get-*.ts`                 | [caching.md](docs/agents/caching.md)               |
| [nextjs.mdc](.cursor/rules/nextjs.mdc)                 | `next.config.ts`, `cache-tags.ts`, `get-*.ts`            | [nextjs.md](docs/agents/nextjs.md)                 |
| [ui-design.mdc](.cursor/rules/ui-design.mdc)           | `src/**/*.tsx`, `*.css`, layouts                         | [ui-design.md](docs/agents/ui-design.md)           |

Human overview: [docs/README.md](docs/README.md). Agent index: [docs/agents/README.md](docs/agents/README.md).

## Non-negotiables

- **Placement:** search upward; inline by default — [architecture.md § Placement](docs/agents/architecture.md#placement).
- **Mutations:** `src/app/action/<segment>/` mirrors `app/<segment>/` — one file per mutation — [implementation.md](docs/agents/implementation.md).
- **Routes, tags, nav copy:** `*-routes.ts`, `cache-tags.ts`, `dashboard-nav-labels.ts` — [architecture.md](docs/agents/architecture.md), [dashboard.md](docs/agents/dashboard.md).
- **Session:** `lib/auth/session.ts` only; never cache session — [implementation.md § Auth](docs/agents/implementation.md#auth--session-srclibauthsessionts).
- **Same-user writes:** `updateTag` in the mutating action — [caching.md](docs/agents/caching.md).
- **UI:** logical Tailwind; do not hand-edit `src/components/ui/*` — [ui-design.md](docs/agents/ui-design.md).
- **Done:** [implementation.md § Definition of done](docs/agents/implementation.md#definition-of-done).
