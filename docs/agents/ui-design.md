# UI styling

> **Context:** Rule `.cursor/rules/ui-design.mdc` on `src/**/*.tsx`, CSS, layouts. Canonical detail here.

## Enforce now

- **`lang` / `dir`:** root layout only — not on inner nodes. Defaults live in `src/lib/app-locale.ts`; root `layout.tsx` and `DirectionProvider` read from there. Changing locale should flip the whole app for RTL/LTR without per-page overrides.
- **Tailwind:** logical spacing and alignment — `ms`/`me`/`ps`/`pe`, `start`/`end`, `text-start`/`text-end`; avoid `ml`/`mr`/`left`/`right` for structure. Popovers: `inline-start` / `inline-end` where applicable.
- **Components:** `src/components/ui` (shadcn/Base UI), default variants; compose primitives before custom markup. Links: `render={<Link … />}`, not `asChild`. Do **not** hand-edit files under `src/components/ui` for project fixes — refresh with the shadcn CLI when upstream changes.
- **Button / TabsTrigger as links:** Base UI defaults `nativeButton` to true (expects `<button>`). With `render={<Link href={…} />}` (or any non-button root), set **`nativeButton={false}`** at the call site in `src/app/**` (see `manage-tabs-nav.tsx`, `pagination.tsx`). Same idea for other primitives that default to native buttons when using `render`.

## Copy & language

- **English** only in the template; no i18n runtime unless the user asks.
- **Dashboard chrome** (sidebar, breadcrumbs, manage tabs): `src/app/dashboard/lib/dashboard-nav-labels.ts` — not inline in nav components.
- **Enum/badge table copy:** `src/lib/badge-labels.ts`.
- File layout is intentional so a later single-language swap or multilingual setup is straightforward — not agent work unless requested.

## Later (humans)

Grouped copy files (`dashboard-nav-labels`, badges, per-feature folders) support swapping language or adding locales without restructuring routes.
