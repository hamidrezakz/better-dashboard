# Caching (tagged cache)

> **Context:** Short rule via `.cursor/rules/caching.mdc` on actions / `cache-tags.ts` / `get-*.ts`. Full reference below.

## Tagged cache flow

1. **Read:** `'use cache'` (or cached server function) + `cacheTag(...)` + `cacheLife(...)` (e.g. `"minutes"`).
2. **Write (Server Action):** invalidate with the **correct** API (below).
3. **Tag strings:** only via segment `cache-tags.ts`, same builders on read and write.
4. **Invalidate:** `updateTag(...)` or `revalidateTag(...)` (see below).

## Which API when

| Situation                                                                                                             | API                                                                                |
| --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Server Action** and the **same user** must see fresh UI right after the mutation (forms, tables, sidebar, switcher) | **`updateTag(tag)`** — read-your-own-writes                                        |
| Server Action but slight staleness is OK                                                                              | `revalidateTag(tag, "max")` or a profile aligned with the read’s `cacheLife`       |
| Route Handler, webhook, or non-action server code                                                                     | `revalidateTag(tag, "max")` (or `{ expire: 0 }` when immediate expiry is required) |
| Invalidate by URL segment, not tag                                                                                    | `revalidatePath(path)`                                                             |
| Client-held dynamic cache not refreshed by `updateTag`                                                                | `refresh()` from the action                                                        |

## Do / don’t

- **Do** call cache invalidation in the **same** Server Action that wrote data.
- **Do** use **`updateTag`** after creates/updates/deletes when the UI on the current page must reflect the change immediately (usual case for dashboard mutations).
- **Don’t** use bare `revalidateTag(tag)` (single argument) — deprecated; in actions prefer **`updateTag`** for immediate UI.
- **Don’t** default to `revalidateTag` in actions when the user is waiting on updated UI — that often serves stale content (stale-while-revalidate).
- **Don’t** revalidate on read-only actions; **don’t** cache or revalidate auth/session reads (use `getSessionCached` / `requireAuthSession` in `auth-session.ts` — see [implementation.md § Auth / session](./implementation.md#auth--session-srclibauth-sessionts)).

**Reference in repo:** `dashboard/components/set-active-organization-action.ts` uses `updateTag` for sidebar; invitation/notification create actions should follow the same pattern when the list must update in-session.

```ts
// read (cached helper or page)
cacheTag(dashboardCacheTags.organizationInvitationsById(orgId));
cacheLife("minutes");

// write (Server Action — user must see new row)
updateTag(dashboardCacheTags.organizationInvitationsById(orgId));
```

if needed, you can read: `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md` and `node_modules/next/dist/docs/01-app/01-getting-started/09-revalidating.md`. See also [nextjs.md](./nextjs.md) for other Next.js doc paths.
