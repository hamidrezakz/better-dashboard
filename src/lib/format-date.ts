export const dateOnlyOptions: Intl.DateTimeFormatOptions = {
  dateStyle: "medium",
};

export const dateTimeOptions: Intl.DateTimeFormatOptions = {
  dateStyle: "medium",
  timeStyle: "short",
};

export function formatDate(
  value: string,
  options: Intl.DateTimeFormatOptions = dateOnlyOptions,
) {
  return new Intl.DateTimeFormat("en-US", options).format(new Date(value));
}
