# Implementation rules & patterns

> **Context:** Rule `.cursor/rules/implementation.mdc` on actions, `auth-session.ts`, `page.tsx`, `layout.tsx`. Canonical detail here.

## Server-first

Default Server Components; `"use client"` only for browser interactivity.

## Mutations → Server Actions

**Action-first** — all writes in `src/app/action/<segment>/`, not `app/api/`. Mirror the route tree (`action/dashboard/...` ↔ `app/dashboard/...`); shared helpers in `shared/`.

- **One action per file.** Flow: validate → mutate DB → invalidate cache if needed → return/redirect.

## Caching reads & writes

- Heavy/repeated reads: `'use cache'` + tags from segment `cache-tags.ts`.
- Same user must see fresh UI after write: **`updateTag`** in that action — [caching.md](./caching.md).

## Suspense for runtime reads

Only the slice that calls `cookies()`, `headers()`, `connection()`, or other request-scoped APIs goes inside `<Suspense>` — not the whole page.

Keep static / `'use cache'` markup **outside** Suspense. Prefer small parallel boundaries.

Docs: [nextjs.md](./nextjs.md).

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

- `dashboard/layout.tsx` calls `requireAuthSession()` once (inside Suspense). Repeat calls OK — same-request dedupe via `cache()`.
- Do **not** pass `redirectTo` under `dashboard/layout`.
- Pages needing `user.id` call `requireAuthSession()` themselves — do not rely on layout props for session.

**Server Actions**

- Dashboard mutations: `requireAuthSession()` then `session.user.id`.
- Do not use `getSessionCached` + silent no-op when auth is required.

## Styling & nav copy

[ui-design.md](./ui-design.md) · [dashboard.md](./dashboard.md)

## Definition of done {#definition-of-done}

- Followed [architecture § Placement](./architecture.md#placement).
- Server-first; targeted `Suspense` only where needed.
- Mutations in `action/<segment>/` (mirror routes, one per file); tags centralized; **`updateTag`** when the actor’s UI must update immediately.
- Nav copy centralized; no cross-sibling feature imports.
- Template scope only — [architecture.md](./architecture.md).
