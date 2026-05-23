# Next.js 16+ (in-repo docs)

> **Context:** Rule `.cursor/rules/nextjs.mdc` on `next.config.ts`, `cache-tags.ts`, `get-*.ts`. Canonical doc index here.

APIs differ from older Next.js. **Do not web-search** — read `node_modules/next/dist/docs/` (this project uses `cacheComponents`).

| Topic                                                                       | Path under `node_modules/next/dist/docs/`                                    |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Caching + PPR / Suspense holes                                              | `01-app/01-getting-started/08-caching.md`                                    |
| Revalidating (`updateTag` vs `revalidateTag`)                               | `01-app/01-getting-started/09-revalidating.md`                               |
| Server Actions                                                              | `01-app/01-getting-started/07-mutating-data.md`                              |
| Streaming / Suspense                                                        | `01-app/02-guides/streaming.md`                                              |
| `cacheComponents` config                                                    | `01-app/03-api-reference/05-config/01-next-config-js/cacheComponents.md`     |
| `use cache`                                                                 | `01-app/03-api-reference/01-directives/use-cache.md`                         |
| `cacheTag` / `cacheLife` / `updateTag` / `revalidateTag` / `revalidatePath` | `01-app/03-api-reference/04-functions/cacheTag.md` (+ sibling function docs) |

**Caching choices in this app:** [caching.md](./caching.md).
