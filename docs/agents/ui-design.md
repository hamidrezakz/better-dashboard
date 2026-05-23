# UI styling

> **Context:** Rule `.cursor/rules/ui-design.mdc` on `src/**/*.tsx`, CSS, layouts. Canonical detail here.

## Enforce now

- **`lang` / `dir`:** root layout only — not on inner nodes. Changing root `lang`/`dir` should flip the whole app for RTL/LTR without per-page overrides.
- **Tailwind:** logical spacing and alignment — `ms`/`me`/`ps`/`pe`, `start`/`end`, `text-start`/`text-end`; avoid `ml`/`mr`/`left`/`right` for structure. Popovers: `inline-start` / `inline-end` where applicable.
- **Components:** `src/components/ui` (shadcn/Base UI), default variants; compose primitives before custom markup. Links: `render={<Link … />}`, not `asChild`.

## Copy & language

- **English** only in the template; no i18n runtime unless the user asks.
- **Dashboard chrome** (sidebar, breadcrumbs, manage tabs): `src/app/dashboard/lib/dashboard-nav-labels.ts` — not inline in nav components.
- **Enum/badge table copy:** `src/lib/i18n/badge-translations.ts` (legacy path name).
- File layout is intentional so a later single-language swap or multilingual setup is straightforward — not agent work unless requested.

## Later (humans)

Grouped copy files (`dashboard-nav-labels`, badges, per-feature folders) support swapping language or adding locales without restructuring routes.
