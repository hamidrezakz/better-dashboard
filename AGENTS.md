---
description: Reusable auth + dashboard template — agent index; open detail only when needed
alwaysApply: true
---

# Agent guide (index)

**Always injected.** Index only — not the full spec.

## Context layers

| Layer | When                          | Source                                                             |
| ----- | ----------------------------- | ------------------------------------------------------------------ |
| **1** | Every chat                    | This file                                                          |
| **2** | Files you touch match `globs` | [.cursor/rules/\*.mdc](.cursor/rules/) — constraints only          |
| **3** | Edge cases, tables, examples  | [docs/agents/](docs/agents/) — **Read** when layer 2 is not enough |

Do not assume layer 3 unless you opened it for this task. If unsure, **Read** the deep doc for that topic (listed below).

## Project

|             |                                                                                         |
| ----------- | --------------------------------------------------------------------------------------- |
| **Stack**   | Next.js 16+ (`cacheComponents`), Prisma 7+, Better Auth v1 (org plugin), shadcn/Base UI |
| **Goal**    | Reusable auth + org/team dashboard template (CLI-injectable feature slices later)       |
| **Data**    | Better Auth `auth` schema only in core — no product Prisma domains in dashboard core    |
| **Next.js** | Not training-data — **no web search**; [nextjs.md](docs/agents/nextjs.md)               |

## Layer 2 → deep doc

| Rule                                                   | Globs (summary)                                          | Read for detail                                    |
| ------------------------------------------------------ | -------------------------------------------------------- | -------------------------------------------------- |
| [architecture.mdc](.cursor/rules/architecture.mdc)     | `src/app/**`, `src/lib/**`, `src/components/**`          | [architecture.md](docs/agents/architecture.md)     |
| [dashboard.mdc](.cursor/rules/dashboard.mdc)           | `src/app/dashboard/**`, `api/dashboard/**`               | [dashboard.md](docs/agents/dashboard.md)           |
| [implementation.mdc](.cursor/rules/implementation.mdc) | `action/**`, `auth-session.ts`, `page.tsx`, `layout.tsx` | [implementation.md](docs/agents/implementation.md) |
| [caching.mdc](.cursor/rules/caching.mdc)               | `action/**`, `cache-tags.ts`, `get-*.ts`                 | [caching.md](docs/agents/caching.md)               |
| [nextjs.mdc](.cursor/rules/nextjs.mdc)                 | `next.config.ts`, `cache-tags.ts`, `get-*.ts`            | [nextjs.md](docs/agents/nextjs.md)                 |
| [ui-design.mdc](.cursor/rules/ui-design.mdc)           | `src/**/*.tsx`, `*.css`, layouts                         | [ui-design.md](docs/agents/ui-design.md)           |

Full doc index: [docs/agents/README.md](docs/agents/README.md).

## Non-negotiables

- **Mutations:** `src/app/action/<feature>/`, one file per mutation — validate → DB → cache (if needed) → return/redirect. Flow: [implementation.md](docs/agents/implementation.md).
- **Layout:** sub-feature → segment `lib/` → `src/lib` \| `src/components`; no cross-sibling feature imports.
- **Paths & tags:** segment `*-routes.ts` + `cache-tags.ts` — no hardcoded strings.
- **Dashboard nav text:** `dashboard-nav-labels.ts` only — [dashboard.md](docs/agents/dashboard.md).
- **Session:** `auth-session.ts`; never `use cache` on session — [implementation.md § Auth](docs/agents/implementation.md#auth--session-srclibauth-sessionts).
- **After dashboard write (same user):** `updateTag` in that action — [caching.md](docs/agents/caching.md).
- **UI:** logical Tailwind; `lang`/`dir` root only — [ui-design.md](docs/agents/ui-design.md).
- **Done checklist:** [implementation.md § Definition of done](docs/agents/implementation.md#definition-of-done).
