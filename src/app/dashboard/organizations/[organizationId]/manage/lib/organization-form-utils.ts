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
    return "Organization name is required.";
  }

  if (name.length > ORGANIZATION_NAME_MAX_LENGTH) {
    return `Organization name must be at most ${ORGANIZATION_NAME_MAX_LENGTH} characters.`;
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
      return "Logo must be an http or https URL.";
    }
  } catch {
    return "Logo must be a valid URL.";
  }

  return null;
}
