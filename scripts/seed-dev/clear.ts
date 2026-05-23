import "dotenv/config";
import { prisma } from "@/lib/prisma";
import {
  FAKE_USER_COUNT,
  ORGANIZATIONS,
  USER_EMAIL_DOMAIN,
  fakeUserId,
} from "./config";

async function main() {
  const orgIds = ORGANIZATIONS.map((o) => o.id);
  const fakeUserIds = Array.from({ length: FAKE_USER_COUNT }, (_, i) =>
    fakeUserId(i),
  );

  const deletedNotifications = await prisma.notification.deleteMany({
    where: {
      OR: [
        { id: { startsWith: "seed_notif_" } },
        { organizationId: { in: orgIds } },
      ],
    },
  });

  const deletedInvitations = await prisma.invitation.deleteMany({
    where: {
      OR: [
        { id: { startsWith: "seed_inv_" } },
        { organizationId: { in: orgIds } },
      ],
    },
  });

  const deletedTeamMembers = await prisma.teamMember.deleteMany({
    where: { id: { startsWith: "seed_tm_" } },
  });

  const deletedTeams = await prisma.team.deleteMany({
    where: { id: { startsWith: "seed_team_" } },
  });

  const deletedMembers = await prisma.member.deleteMany({
    where: {
      OR: [
        { id: { startsWith: "seed_member_" } },
        { organizationId: { in: orgIds } },
      ],
    },
  });

  const deletedOrgs = await prisma.organization.deleteMany({
    where: { id: { in: orgIds } },
  });

  const deletedUsers = await prisma.user.deleteMany({
    where: {
      OR: [
        { id: { in: fakeUserIds } },
        { email: { endsWith: `@${USER_EMAIL_DOMAIN}` } },
      ],
    },
  });

  console.log("Seed dev cleared");
  console.table({
    notifications: deletedNotifications.count,
    invitations: deletedInvitations.count,
    teamMembers: deletedTeamMembers.count,
    teams: deletedTeams.count,
    members: deletedMembers.count,
    organizations: deletedOrgs.count,
    users: deletedUsers.count,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
