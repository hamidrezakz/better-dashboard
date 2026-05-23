# UI styling

> Short rule: `.cursor/rules/ui-design.mdc`

**Now (what agents enforce):** styling only — logical Tailwind; shadcn defaults.

**Later (for humans, not built in template):** dashboard copy is grouped (`dashboard-nav-labels.ts`, badge map, per-feature folders) so someone can swap to another single language or add multilingual structure without fighting the layout. Do not add locale libraries or bilingual wiring unless the user asks.

**Language today:** English only. No i18n runtime.

**Direction:** `lang` and `dir` on the root layout only — not on inner nodes.

**Tailwind:** `ms`/`me`/`ps`/`pe`, `start`/`end`, `text-start`/`text-end` — not `ml`/`mr`/`left`/`right` for structure. Popovers: `inline-start` / `inline-end` where applicable. due to this is a a global application and we wanna make it easy to change the direction of the application, if someone wants to change the direction of the application, they can just change the `lang` and `dir` on the root layout and the application will be changed to the new direction.

**Components:** Use `src/components/ui` (shadcn/Base UI) with **default** variants and stock styling; compose primitives before custom markup. Base UI links: `render={<Link … />}`, not `asChild`.

**Copy:** Nav/chrome strings in `dashboard-nav-labels.ts` — not inline in sidebar/breadcrumb components.
