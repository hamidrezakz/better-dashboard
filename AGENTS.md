---
description: Reusable auth + dashboard template — agent index; open detail only when needed
alwaysApply: true
---

# Agent guide (index)

**This file is always injected.** It is a short index, not the full spec.

## How context is injected (Cursor standard)

Three layers — use the lightest layer that fits the task:

| Layer                             | When it applies                                                        | Source                                                                                |
| --------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **1. Index (always)**             | Every conversation                                                     | This file (`AGENTS.md`, `alwaysApply: true`)                                          |
| **2. Context rules (automatic)**  | Cursor attaches matching rules when you touch files that match `globs` | [.cursor/rules/\*.mdc](.cursor/rules/) — concise; `alwaysApply: false`                |
| **3. Deep reference (on demand)** | Tables, examples, edge cases, or unclear cases                         | [docs/agents/\*.md](docs/agents/) — open with Read only when layer 1–2 are not enough |

Do not assume you have read layer 3 unless you opened that file for the current task. Layer 2 may attach mid-task when relevant files are in context — follow those rules for that work.

## Project (layer 1 — always)

|             |                                                                                                                                                     |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Stack**   | Next.js 16+ App Router + `cacheComponents`, Prisma 7+, Better Auth v1 (org plugin), shadcn/Base UI                                                  |
| **Goal**    | **Reusable template** — auth + org/team dashboard to copy across projects (future extract as a library)                                             |
| **Phase 1** | **`auth` schema only** for dashboard work — ignore `exam` and `better-s3` in this template                                                          |
| **Copy**    | **Single language** (sample: Persian + RTL). No i18n runtime. Nav strings: `dashboard-nav-labels.ts`. See [dashboard.md](docs/agents/dashboard.md). |
| **Next.js** | Not training-data Next — **no web search**; `node_modules/next/dist/docs/`                                                                          |

## Layer 2 — which rule attaches (by glob)

| Rule file                                              | Typical trigger paths                                              | Deep doc                                           |
| ------------------------------------------------------ | ------------------------------------------------------------------ | -------------------------------------------------- |
| [architecture.mdc](.cursor/rules/architecture.mdc)     | `src/app/**`, `src/lib/**`, `src/components/**`                    | [architecture.md](docs/agents/architecture.md)     |
| [dashboard.mdc](.cursor/rules/dashboard.mdc)           | `src/app/dashboard/**`, `src/app/api/dashboard/**`                 | [dashboard.md](docs/agents/dashboard.md)           |
| [implementation.mdc](.cursor/rules/implementation.mdc) | `src/app/**/*.tsx`, `src/app/action/**/*.ts`, `auth-session.ts`    | [implementation.md](docs/agents/implementation.md) |
| [caching.mdc](.cursor/rules/caching.mdc)               | `src/app/action/**`, `**/cache-tags.ts`, `src/app/**/lib/get-*.ts` | [caching.md](docs/agents/caching.md)               |
| [nextjs.mdc](.cursor/rules/nextjs.mdc)                 | `next.config.ts`, `src/app/**`                                     | [nextjs.md](docs/agents/nextjs.md)                 |

## Non-negotiables (layer 1 — even without opening more)

- **Mutations:** `src/app/action/<feature>/`, one action per file; validate → DB → cache (if needed) → return/redirect.
- **Layout:** sub-feature → segment `lib/` → `src/lib` \| `src/components`; no cross-sibling feature imports.
- **Paths & tags:** `*-routes.ts` and `cache-tags.ts` per segment — no hardcoded path/tag strings.
- **Dashboard nav copy:** `src/app/dashboard/lib/dashboard-nav-labels.ts` for sidebar, breadcrumbs, manage tabs — not duplicated in UI files.
- **Session:** `src/lib/auth-session.ts` (`getSessionCached` / `requireAuthSession`) — request-scoped only; never `use cache` or revalidate session. Dashboard: `requireAuthSession()` without `redirectTo` under `dashboard/layout`. Details: [implementation.md](docs/agents/implementation.md#auth--session-srclibauth-sessionts).
- **Same-user UI after dashboard write:** **`updateTag`** in the same Server Action (not bare `revalidateTag`).
