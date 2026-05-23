# Implementation rules & patterns

> **Context:** Short rule via `.cursor/rules/implementation.mdc` on `*.tsx` under `src/app` and `src/components`. Full reference below.

## Core rules

### Server-first

- Default to Server Components; add `"use client"` only for browser interactivity and when really needed.

### Mutations → Server Actions only

- Path: `src/app/action/<feature>/`, **one action per file** (`logout-action.ts`, …).
- **Folder layout:** mirror the app segment (e.g. dashboard `components/`, `users/`, `organizations/manage/invitations/`) so actions are easy to find; segment-wide helpers stay in `action/<feature>/shared/`.
- Flow: validate → mutate DB → update cache (if needed) → return/redirect.

### Caching

- Use `use cache` in server functions that run heavy or repeated reads.
- Use `updateTag(...)` or `revalidateTag(...)` to invalidate the cache.
- See [caching.md](./caching.md) for more details.

### Suspense for runtime reads

- Only the **dynamic slice** that calls `cookies()`, `headers()`, `connection()`, or other request-scoped APIs goes inside `<Suspense>` — **not** the whole page or layout.
- Keep static/cached shells (`'use cache'`, deterministic markup) **outside** Suspense so PPR can prerender them.
- Prefer **small, targeted** boundaries; use **parallel** `<Suspense>` siblings for independent dynamic blocks, and **nested** Suspense when a subtree has its own slow part.
- See `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md` (streaming / dynamic holes) and `node_modules/next/dist/docs/01-app/02-guides/streaming.md`.

### Auth / session (`src/lib/auth-session.ts`)

Session reads use React `cache()` — **one `getSession` per request**, never `use cache` / `cacheTag` / `revalidateTag` on session.

| Helper                               | Use when                                                                                                         |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| **`getSessionCached()`**             | Optional session (nullable). **Route Handlers:** if no user → `401` JSON, not `redirect`.                        |
| **`requireAuthSession()`**           | Must be signed in. **Dashboard** layouts, pages, and Server Actions — default post-login return is `/dashboard`. |
| **`requireAuthSession(returnPath)`** | Only **outside** the dashboard auth gate (e.g. join before accept) so login returns to the right URL.            |

**Dashboard tree**

- `dashboard/layout.tsx` calls `requireAuthSession()` once (inside Suspense). Descendant layouts use `dashboard-access` guards; they may call `requireAuthSession()` again — same request dedupes via `cache()`.
- Do **not** pass `redirectTo` under the dashboard layout; it only affects logged-out users and the root layout already handles that.
- Pages that need `user.id` still call `requireAuthSession()` (no prop); do not rely on layout props for session.

**Server Actions**

- Dashboard mutations: `requireAuthSession()` then use `session.user.id` (or `await requireAuthSession()` as an auth-only gate).
- Do not use `getSessionCached` + silent no-op when the action must be authenticated — prefer `requireAuthSession` for consistent redirect-to-login.

**Parallel Suspense slices** on one page may each call `requireAuthSession()` (and each call their own `get-*` with `'use cache'`). **Do not** add an extra page-level `cache()` wrapper just to dedupe session — `requireAuthSession` / `getSessionCached` already dedupe per request. Cached data functions dedupe via `'use cache'` + tags. Extra `cache()` on a page is optional only when you intentionally bundle non-cached steps once per segment (rare).

### Copy & styling

- English, single language; no i18n runtime. Nav: `dashboard-nav-labels.ts`. Badges: `badge-translations.ts` — see [dashboard.md](./dashboard.md).
- Styling: [ui-design.md](./ui-design.md) (logical Tailwind; `lang`/`dir` on root layout only).

## Definition of done

- Server-first; only dynamic slices behind targeted `Suspense` (parallel/nested when useful).
- New UI/utils: searched upward; shadcn primitives preferred; no duplicate helpers.
- Tags centralized; mutations use **`updateTag`** when the acting user’s UI must update immediately.
- Auth compatible with Better Auth + organization plugin.
- UI uses shared primitives; nav copy centralized per [dashboard.md](./dashboard.md).
- New UI: shadcn defaults + [ui-design.md](./ui-design.md).
- Feature fits modular layout; no cross-sibling feature imports.
- Stays within template scope (Better Auth dashboard slice only).

## Minimal patterns

**Suspense — wrap only the dynamic part**

```tsx
export default function Page() {
  return (
    <>
      <StaticHeader />
      <Suspense fallback={<SidebarSkeleton />}>
        <SidebarWithSession />
      </Suspense>
      <Suspense fallback={<TableSkeleton />}>
        <MembersTable />
      </Suspense>
    </>
  );
}
```

**Base UI + Link**

```tsx
<Button render={<Link href="/dashboard" />}>Dashboard</Button>
```
