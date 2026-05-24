# Agent documentation

**Not injected by default.** Open with Read when layer 1–2 are not enough.

## Workflow

1. [AGENTS.md](../../AGENTS.md) — always (index + non-negotiables).
2. Matching [.cursor/rules/\*.mdc](../../.cursor/rules/) when you touch files in those globs.
3. One file below when you need tables, examples, or checklists.

**DRY:** Each topic has one home here. `.mdc` files enforce in-context only; detail lives below.

## Files

| File                                     | Open when                                             |
| ---------------------------------------- | ----------------------------------------------------- |
| [architecture.md](./architecture.md)     | **Placement**, layout, SSOT, over-extract, CLI slices |
| [dashboard.md](./dashboard.md)           | Dashboard routes, nav, tables/forms, new route        |
| [implementation.md](./implementation.md) | RSC, Suspense, actions, session, definition of done   |
| [caching.md](./caching.md)               | `cacheTag`, `updateTag`, invalidation                 |
| [nextjs.md](./nextjs.md)                 | In-repo Next.js doc paths                             |
| [ui-design.md](./ui-design.md)           | Logical Tailwind, shadcn vendor boundary, Link+Button |
