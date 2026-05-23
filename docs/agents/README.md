# Agent documentation

**Not injected by default.** Open with Read when layer 1–2 are not enough.

## Model

| Layer                                        | Role                                                |
| -------------------------------------------- | --------------------------------------------------- |
| [AGENTS.md](../../AGENTS.md)                 | Index + non-negotiables (always)                    |
| [.cursor/rules/\*.mdc](../../.cursor/rules/) | Short constraints when globs match                  |
| This folder                                  | Tables, examples, checklists — **canonical detail** |

**DRY:** Each topic has one home here. `.mdc` files only repeat what must be enforced in-context; everything else lives below.

## Files

| File                                     | Open when                                            |
| ---------------------------------------- | ---------------------------------------------------- |
| [architecture.md](./architecture.md)     | Where code belongs, modularity, CLI-ready slices     |
| [dashboard.md](./dashboard.md)           | Routes, nav labels, breadcrumbs, new dashboard route |
| [implementation.md](./implementation.md) | RSC, Suspense, actions, session, definition of done  |
| [caching.md](./caching.md)               | `cacheTag`, `updateTag`, invalidation                |
| [nextjs.md](./nextjs.md)                 | In-repo Next.js doc paths                            |
| [ui-design.md](./ui-design.md)           | Logical Tailwind, shadcn, root `lang`/`dir`          |
