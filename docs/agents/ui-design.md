# UI styling

> **Context:** Rule `.cursor/rules/ui-design.mdc` on `src/**/*.tsx`, CSS, layouts. Canonical detail here.

## Enforce now

- **`lang` / `dir`:** root layout only — not on inner nodes. Defaults live in `src/lib/app-locale.ts`; root `layout.tsx` and `DirectionProvider` read from there. Changing locale should flip the whole app for RTL/LTR without per-page overrides.
- **Tailwind:** logical spacing and alignment — `ms`/`me`/`ps`/`pe`, `start`/`end`, `text-start`/`text-end`; avoid `ml`/`mr`/`left`/`right` for structure. Popovers: `inline-start` / `inline-end` where applicable.
- **Components:** `src/components/ui` (shadcn/Base UI), default variants; compose primitives before custom markup. Search upward for an existing wrapper before duplicating markup; hoist reusable UI to the highest relevant scope (segment `components/` → `src/components/`). Links: `render={<Link … />}`, not `asChild`.
- **`src/components/ui` is vendor-owned:** agents must **not** patch files there for product behavior (mobile sidebar on navigate, dashboard-only logic, link props, etc.). Implement in segment or shared app components and use public APIs (`useSidebar`, `render={…}`, wrappers). Update primitives only via **shadcn CLI** when upstream or registry changes. Example: mobile sidebar closes on route change via `dashboard/components/sidebar/dashboard-sidebar-close-on-navigate.tsx` inside `SidebarProvider`, not edits to `components/ui/sidebar.tsx`.
- **Button / TabsTrigger as links:** Base UI defaults `nativeButton` to true (expects `<button>`). With `render={<Link href={…} />}` (or any non-button root), set **`nativeButton={false}`** at the call site in `src/app/**` (see `manage-tabs-nav.tsx`, `pagination.tsx`). Same idea for other primitives that default to native buttons when using `render`.

## Dashboard tables (variable DB text)

Do **not** change table layout globally (`table-fixed`, shared layout modules, or narrowing action/badge columns) unless the user asks.

For cell content that comes from the database and can be long (email, title, body preview, names, labels):

- Put **`truncate`** on the **text element** (`<span>` / `<p>`), usually with **`block`** or **`max-w-*`** on that same element.
- Pick **`max-w-*` per field** so mobile stays readable (e.g. email `max-w-md`, titles `max-w-xs sm:max-w-sm`, short labels `max-w-40`–`max-w-48`). Tune per column; no one-size helper file.
- Add **`title={fullValue}`** when truncation hides meaningful text.
- Badges, counts, dates, and action menus: leave as-is unless they overflow.

## Dashboard feedback & form footers

**Mutation feedback (success / server error):** call `toast.success` / `toast.error` from `sonner` at the call site — no segment wrapper module. `<Toaster />` is mounted in the root layout. Do **not** lift feedback into table/panel state or render banners above tables — toasts survive client navigation within the app.

**Field validation (client):** show errors only after the field is touched (blur) or submit was attempted. Use `aria-invalid` and `aria-describedby` on the control. Keep server/action errors on toast unless the dialog stays open and inline copy is required.

**Form shell footers:** use `DashboardFormShellFooterActions` from `src/app/dashboard/components/form-shell/dashboard-form-shell-footer-actions.tsx`. DOM order is always **Cancel** (outline) then **primary**; `DashboardFormShellFooter` applies `flex-col-reverse` on mobile so primary appears on top. Reserve `variant="destructive"` for destructive **actions** (delete, remove), never for Cancel.

## Copy & language

- **English** only in the template; no i18n runtime unless the user asks.
- **Dashboard chrome** (sidebar, breadcrumbs, manage tabs): `src/app/dashboard/lib/dashboard-nav-labels.ts` — not inline in nav components.
- **Enum/badge table copy:** `src/lib/badge-labels.ts`.
- File layout is intentional so a later single-language swap or multilingual setup is straightforward — not agent work unless requested.

## Later (humans)

Grouped copy files (`dashboard-nav-labels`, badges, per-feature folders) support swapping language or adding locales without restructuring routes.
