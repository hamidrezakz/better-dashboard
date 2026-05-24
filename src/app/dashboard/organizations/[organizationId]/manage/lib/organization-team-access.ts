import { prisma } from "@/lib/prisma";

export async function getOrganizationTeamInOrg(input: {
  organizationId: string;
  teamId: string;
}) {
  return prisma.team.findFirst({
    where: {
      id: input.teamId,
      organizationId: input.organizationId,
    },
    select: {
      id: true,
      name: true,
      organizationId: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          teammembers: true,
        },
      },
    },
  });
}
