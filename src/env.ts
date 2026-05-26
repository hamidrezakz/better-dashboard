import { serverSchema, type ServerEnv } from "@/env.schema";

function createEnv(): ServerEnv {
  const parsed = serverSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "Invalid environment variables:",
      parsed.error.flatten().fieldErrors,
    );
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
}

export const env = createEnv();
