import { betterAuth } from "better-auth/minimal";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin, organization } from "better-auth/plugins";
import { env } from "@/env";
import { UserRole } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  trustedOrigins: [
    env.BETTER_AUTH_URL,
    env.NEXT_PUBLIC_BETTER_AUTH_URL,
    "http://localhost:3000",
  ].filter(Boolean) as string[],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  cookieCache: {
    enabled: true,
    maxAge: 5 * 60, // Cache duration in seconds
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      defaultRole: UserRole.user,
      adminRoles: [UserRole.admin],
    }),
    organization({
      teams: {
        enabled: true,
      },
    }),
    nextCookies(),
  ],
});
