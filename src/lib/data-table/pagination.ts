const numberFormat = new Intl.NumberFormat("en-US");

export function formatDataTableNumber(value: number) {
  return numberFormat.format(value);
}

export function getDataTableItemRange(
  page: number,
  pageSize: number,
  totalCount: number,
): { start: number; end: number } {
  if (totalCount <= 0) {
    return { start: 0, end: 0 };
  }

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);
  return { start, end };
}

export function buildDataTablePageNumbers(
  current: number,
  total: number,
): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages: (number | "...")[] = [1];

  if (current > 3) {
    pages.push("...");
  }

  for (
    let page = Math.max(2, current - 1);
    page <= Math.min(total - 1, current + 1);
    page++
  ) {
    pages.push(page);
  }

  if (current < total - 2) {
    pages.push("...");
  }

  pages.push(total);
  return pages;
}
