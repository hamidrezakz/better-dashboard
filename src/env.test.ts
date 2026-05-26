import { describe, expect, it } from "vitest";
import { serverSchema } from "@/env.schema";

describe("serverSchema", () => {
  it("accepts required variables", () => {
    const result = serverSchema.safeParse({
      DATABASE_URL: "postgresql://localhost:5432/app",
      BETTER_AUTH_SECRET: "test-secret",
      BETTER_AUTH_URL: "http://localhost:3000",
      NEXT_PUBLIC_BETTER_AUTH_URL: "http://localhost:3000",
      NEXT_PUBLIC_URL: "http://localhost:3000",
      DASHBOARD_SUPER_ADMIN_IDS: "user-1,user-2",
    });

    expect(result.success).toBe(true);
  });

  it("rejects missing DATABASE_URL", () => {
    const result = serverSchema.safeParse({
      BETTER_AUTH_SECRET: "test-secret",
    });

    expect(result.success).toBe(false);
  });
});
