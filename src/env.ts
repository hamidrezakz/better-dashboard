function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export type ServerEnv = {
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL?: string;
  NEXT_PUBLIC_BETTER_AUTH_URL?: string;
  NEXT_PUBLIC_URL?: string;
  DASHBOARD_SUPER_ADMIN_IDS?: string;
};

export const env: ServerEnv = {
  DATABASE_URL: requireEnv("DATABASE_URL"),
  BETTER_AUTH_SECRET: requireEnv("BETTER_AUTH_SECRET"),
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  DASHBOARD_SUPER_ADMIN_IDS: process.env.DASHBOARD_SUPER_ADMIN_IDS,
};
