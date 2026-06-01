/**
 * Single place to change default document language and layout direction.
 * Wire root `layout.tsx` and `DirectionProvider` from here when swapping EN ↔ RTL locales.
 */
export const appLocale = {
  lang: "fa",
  dir: "rtl",
} as const;

export type AppLocale = typeof appLocale;
