# Implementation rules & patterns

> **Context:** Rule `.cursor/rules/implementation.mdc` on actions, `auth-session.ts`, `page.tsx`, `layout.tsx`. Canonical detail here.

## Server-first

Default Server Components; `"use client"` only for browser interactivity.

## Mutations → Server Actions

- Path: `src/app/action/<feature>/` — **one action per file**.
- Mirror the app segment (`action/dashboard/...` mirrors `app/dashboard/...`); segment helpers in `action/<feature>/shared/`.
- Flow: validate → mutate DB → invalidate cache if needed → return/redirect.

## Caching reads & writes

- Heavy/repeated reads: `'use cache'` + tags from segment `cache-tags.ts`.
- After mutations when the **same user** must see fresh UI: **`updateTag`** in that action — see [caching.md](./caching.md).
- Do not use vague `revalidateTag` in actions when the actor is waiting on updated UI.

## Suspense for runtime reads

Only the slice that calls `cookies()`, `headers()`, `connection()`, or other request-scoped APIs goes inside `<Suspense>` — not the whole page.

Keep static / `'use cache'` markup **outside** Suspense. Prefer small parallel boundaries; nest when a subtree has its own slow part.

Docs: [nextjs.md](./nextjs.md) → `08-caching.md`, `streaming.md`.

### Example

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

## Auth / session (`src/lib/auth-session.ts`)

Session uses React `cache()` — **one `getSession` per request**. Never `use cache` / `cacheTag` / `revalidateTag` on session.

| Helper                               | Use when                                                                            |
| ------------------------------------ | ----------------------------------------------------------------------------------- |
| **`getSessionCached()`**             | Optional session (nullable). Route Handlers: no user → `401` JSON, not redirect.    |
| **`requireAuthSession()`**           | Must be signed in. Dashboard layouts, pages, actions — default return `/dashboard`. |
| **`requireAuthSession(returnPath)`** | Outside dashboard auth gate (e.g. join) so login returns to the right URL.          |

**Dashboard tree**

- `dashboard/layout.tsx` calls `requireAuthSession()` once (inside Suspense). Descendants use access guards; repeat `requireAuthSession()` is OK — same-request dedupe via `cache()`.
- Do **not** pass `redirectTo` under `dashboard/layout`.
- Pages needing `user.id` call `requireAuthSession()` themselves — do not rely on layout props for session.

**Server Actions**

- Dashboard mutations: `requireAuthSession()` then `session.user.id`.
- Do not use `getSessionCached` + silent no-op when auth is required.

Parallel Suspense slices may each call `requireAuthSession()` and their own `get-*` with `'use cache'`. Do not add an extra page-level `cache()` wrapper just to dedupe session.

## Base UI + Link

```tsx
<Button render={<Link href="/dashboard" />}>Dashboard</Button>
```

## Styling & nav copy

[ui-design.md](./ui-design.md) · [dashboard.md](./dashboard.md)

## Definition of done

- Server-first; targeted `Suspense` only where needed.
- New helpers: searched upward; shadcn first; no duplicate utilities.
- Tags centralized; dashboard mutations use **`updateTag`** when the actor’s UI must update immediately.
- Better Auth + organization plugin compatible.
- Nav copy centralized; modular layout; no cross-sibling feature imports.
- Template scope only (auth dashboard slice) — see [architecture.md](./architecture.md).
