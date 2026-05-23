import { prisma } from "@/lib/prisma";

const CREDENTIAL_PROVIDER_ID = "credential";

export async function getUserHasPasswordCredential(userId: string) {
  const account = await prisma.account.findFirst({
    where: {
      userId,
      providerId: CREDENTIAL_PROVIDER_ID,
      password: { not: null },
    },
    select: { id: true },
  });

  return account != null;
}
