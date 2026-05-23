# Agent documentation

Long-form guides for coding agents. **Not injected by default.**

| File                                     | Use when                                                    |
| ---------------------------------------- | ----------------------------------------------------------- |
| [architecture.md](./architecture.md)     | Layout, scope, CLI-ready modularity, shared standards       |
| [dashboard.md](./dashboard.md)           | Routes, nav labels, breadcrumbs, trimming optional features |
| [implementation.md](./implementation.md) | RSC, Suspense, actions flow, session, UI patterns           |
| [caching.md](./caching.md)               | `cacheTag`, `updateTag`, invalidation                       |
| [nextjs.md](./nextjs.md)                 | In-repo Next.js doc paths                                   |
| [ui-design.md](./ui-design.md)           | Logical Tailwind; `dir`/`lang` on root only                 |

**Injection model:** see root [AGENTS.md](../../AGENTS.md) — index (always) → `.cursor/rules/*.mdc` (globs) → these files (Read on demand).
