import { z } from "zod";

export const serverSchema = z.object({
  DATABASE_URL: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.string().url().optional(),
  NEXT_PUBLIC_BETTER_AUTH_URL: z.string().url().optional(),
  NEXT_PUBLIC_URL: z.string().optional(),
  DASHBOARD_SUPER_ADMIN_IDS: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverSchema>;
