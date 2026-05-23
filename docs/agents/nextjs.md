# Next.js 16+ (in-repo docs)

> **Context:** Short rule via `.cursor/rules/nextjs.mdc` on `src/app/**` and `next.config.ts`. Full index below.

APIs and conventions differ from older Next.js. **Do not web-search** — read in-repo docs under `node_modules/next/dist/docs/` (this project enables `cacheComponents`).

## Doc some important paths

| Topic                                                                       | In-repo path                                                                                                                                                         |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Caching + PPR / Suspense holes                                              | `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md`                                                                                                |
| Revalidating (`updateTag` vs `revalidateTag`)                               | `node_modules/next/dist/docs/01-app/01-getting-started/09-revalidating.md`                                                                                           |
| Server Actions                                                              | `node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md`                                                                                          |
| Streaming / Suspense patterns                                               | `node_modules/next/dist/docs/01-app/02-guides/streaming.md`                                                                                                          |
| `cacheComponents` config                                                    | `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/cacheComponents.md`                                                                 |
| `use cache` directive                                                       | `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache.md`                                                                                     |
| `cacheTag` / `cacheLife` / `updateTag` / `revalidateTag` / `revalidatePath` | `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/cacheTag.md` (and sibling `cacheLife.md`, `updateTag.md`, `revalidateTag.md`, `revalidatePath.md`) |
