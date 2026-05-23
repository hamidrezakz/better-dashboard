# Caching (tagged cache)

> **Context:** Rule `.cursor/rules/caching.mdc` on actions, `cache-tags.ts`, `get-*.ts`. Canonical detail here.

## Flow

1. **Read:** `'use cache'` (or cached server function) + `cacheTag(...)` + `cacheLife(...)` (e.g. `"minutes"`).
2. **Write:** invalidate in the **same** Server Action that mutated.
3. **Tags:** only builders in segment `cache-tags.ts` — same on read and write.

## Which API when

| Situation                                                                                     | API                                                                         |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Server Action; **same user** must see fresh UI immediately (forms, tables, sidebar, switcher) | **`updateTag(tag)`**                                                        |
| Server Action; slight staleness OK                                                            | `revalidateTag(tag, "max")` (or profile aligned with read `cacheLife`)      |
| Route Handler, webhook, non-action server code                                                | `revalidateTag(tag, "max")` or `{ expire: 0 }` when immediate expiry needed |
| Invalidate by URL segment                                                                     | `revalidatePath(path)`                                                      |
| Client dynamic cache not refreshed by `updateTag`                                             | `refresh()` from the action                                                 |

## Do / don’t

- **Do** invalidate in the action that wrote data.
- **Do** use **`updateTag`** after CRUD when the current page UI must reflect the change (usual dashboard case).
- **Don’t** use bare `revalidateTag(tag)` (single arg) — deprecated for this pattern.
- **Don’t** default to `revalidateTag` in actions when the user waits on updated UI (stale-while-revalidate).
- **Don’t** revalidate on read-only actions; **don’t** cache session — [implementation.md § Auth](./implementation.md#auth--session-srclibauth-sessionts).

**Repo reference:** `dashboard/components/set-active-organization-action.ts` (`updateTag` for sidebar). Invitation/notification creates: same pattern when the list must update in-session.

```ts
cacheTag(dashboardCacheTags.organizationInvitationsById(orgId));
cacheLife("minutes");

// same action after write
updateTag(dashboardCacheTags.organizationInvitationsById(orgId));
```

Next.js paths: [nextjs.md](./nextjs.md) · `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md`, `09-revalidating.md`.
