# Caching (tagged cache)

> **Context:** Rule `.cursor/rules/caching.mdc` on actions, `cache-tags.ts`, `get-*.ts`. Canonical detail here.

## Flow

1. **Read:** `'use cache'` + `cacheTag(...)` + `cacheLife(...)` (e.g. `"minutes"`). (if needed)
2. **Write:** invalidate in the **same** Server Action that mutated.
3. **Tags:** only builders in segment `cache-tags.ts` — same on read and write.

## Which API when

| Situation                                                  | API                                            |
| ---------------------------------------------------------- | ---------------------------------------------- |
| Server Action; **same user** must see fresh UI immediately | **`updateTag(tag)`**                           |
| Server Action; slight staleness OK                         | `revalidateTag(tag, "max")`                    |
| Route Handler, webhook, non-action server code             | `revalidateTag(tag, "max")` or `{ expire: 0 }` |
| Invalidate by URL segment                                  | `revalidatePath(path)`                         |
| Client cache not refreshed by `updateTag`                  | `refresh()` from the action                    |

## Do / don’t

- **Do** invalidate in the action that wrote data.
- **Do** use **`updateTag`** when the current page UI must reflect the change (usual dashboard case).
- **Don’t** use bare `revalidateTag(tag)` (single arg).
- **Don’t** default to `revalidateTag` in actions when the user waits on updated UI.
- **Don’t** revalidate on read-only actions.
- Session: [implementation.md § Auth](./implementation.md#auth--session-srclibauthsessionts).

```ts
cacheTag(dashboardCacheTags.organizationInvitationsById(orgId));
cacheLife("minutes");
// same action after write
updateTag(dashboardCacheTags.organizationInvitationsById(orgId));
```

Next.js paths: [nextjs.md](./nextjs.md).
