export const ORGANIZATION_NAME_MAX_LENGTH = 120;

export type OrganizationBranding = {
  id: string;
  name: string;
  logo: string | null;
};

export function normalizeOrganizationName(value: string) {
  return value.trim();
}

export function normalizeOrganizationLogo(value: string) {
  return value.trim();
}

export function validateOrganizationName(value: string): string | null {
  const name = normalizeOrganizationName(value);

  if (!name) {
    return "نام سازمان الزامی است.";
  }

  if (name.length > ORGANIZATION_NAME_MAX_LENGTH) {
    return `نام سازمان حداکثر ${ORGANIZATION_NAME_MAX_LENGTH} کاراکتر می‌تواند باشد.`;
  }

  return null;
}

export function validateOrganizationLogo(value: string): string | null {
  const logo = normalizeOrganizationLogo(value);

  if (!logo) {
    return null;
  }

  try {
    const url = new URL(logo);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return "آدرس لوگو باید با http یا https باشد.";
    }
  } catch {
    return "آدرس لوگو معتبر نیست.";
  }

  return null;
}
