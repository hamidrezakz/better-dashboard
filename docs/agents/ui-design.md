# UI styling

> **Context:** Rule `.cursor/rules/ui-design.mdc` on `src/**/*.tsx`, CSS, layouts. Canonical detail here.

Placement (search upward, hoist): [architecture.md § Placement](./architecture.md#placement). Dashboard tables, forms, toasts: [dashboard.md](./dashboard.md).

## Enforce now

- **`lang` / `dir`:** root layout only — `src/lib/app-locale.ts`; root `layout.tsx` and `DirectionProvider`. No per-page overrides.
- **Tailwind:** logical spacing — `ms`/`me`/`ps`/`pe`, `start`/`end`, `text-start`/`text-end`; avoid `ml`/`mr`/`left`/`right` for structure.
- **shadcn:** `src/components/ui`, default variants; compose before custom markup.
- **Vendor boundary:** do **not** hand-edit `src/components/ui/*` for app behavior. Wrap in `src/app/**` or `src/components/` (outside `ui/`); regen via **shadcn CLI**. Example: mobile sidebar close on navigate → `dashboard/components/sidebar/dashboard-sidebar-close-on-navigate.tsx`, not `ui/sidebar.tsx`.
- **Links:** `render={<Link href="…" />}`, not `asChild`.
- **`Button` / `TabsTrigger` + Link:** set **`nativeButton={false}`** at call sites in `src/app/**` when `render` is not a `<button>`.

## Copy

- English in template; no i18n unless requested.
- Dashboard chrome: `dashboard-nav-labels.ts`. Badge copy: `badge-labels.ts` (just for global things like statuses, roles, etc.)

## Later (humans)

Grouped copy files support locale swap without restructuring routes. Multilingual setup is not default agent work.
