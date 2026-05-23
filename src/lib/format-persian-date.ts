export const persianDateOnlyOptions: Intl.DateTimeFormatOptions = {
  dateStyle: "medium",
};

export const persianDateTimeOptions: Intl.DateTimeFormatOptions = {
  dateStyle: "medium",
  timeStyle: "short",
};

export function formatPersianDate(
  value: string,
  options: Intl.DateTimeFormatOptions = persianDateOnlyOptions,
) {
  return new Intl.DateTimeFormat("fa-IR", options).format(new Date(value));
}

/** همان `persianDateTimeOptions` داخل پرانتز، مثلاً (۱۳ خرداد ۱۴۰۵، ۳:۴۶) */
export function formatPersianDateWithParenthesizedTime(value: string) {
  return `(${formatPersianDate(value, persianDateTimeOptions)})`;
}
