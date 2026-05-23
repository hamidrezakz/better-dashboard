# Agent documentation

Long-form guides for coding agents. **Not injected by default.**

| File                                     | Use when                                 |
| ---------------------------------------- | ---------------------------------------- |
| [architecture.md](./architecture.md)     | Layout, scope, shared standards          |
| [dashboard.md](./dashboard.md)           | Routes, nav labels, breadcrumbs, forking |
| [implementation.md](./implementation.md) | RSC, Suspense, actions flow, UI patterns |
| [caching.md](./caching.md)               | `cacheTag`, `updateTag`, invalidation    |
| [nextjs.md](./nextjs.md)                 | In-repo Next.js doc paths                |

**Injection model:** see root [AGENTS.md](../../AGENTS.md) — index (always) → `.cursor/rules/*.mdc` (globs) → these files (Read on demand).
