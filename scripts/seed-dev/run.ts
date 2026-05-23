import "dotenv/config";
import { prisma } from "@/lib/prisma";
import { OWNER_USER_ID, USER_EMAIL_DOMAIN } from "./config";
import { buildSeedInvitations } from "./data/invitations";
import { buildSeedMembers } from "./data/members";
import { buildSeedNotifications } from "./data/notifications";
import { buildSeedOrganizations } from "./data/organizations";
import { buildSeedTeamMembers } from "./data/team-members";
import { buildSeedTeams } from "./data/teams";
import { buildSeedUsers } from "./data/users";

async function assertOwnerExists() {
  const owner = await prisma.user.findUnique({
    where: { id: OWNER_USER_ID },
    select: { id: true, email: true },
  });

  if (!owner) {
    throw new Error(
      `کاربر ${OWNER_USER_ID} در دیتابیس نیست. اول با همان حساب ثبت‌نام کن.`,
    );
  }

  console.log(`Owner: ${owner.email} (${owner.id})`);
}

async function main() {
  await assertOwnerExists();

  const users = buildSeedUsers();
  const organizations = buildSeedOrganizations();
  const members = buildSeedMembers();
  const teams = buildSeedTeams();
  const teamMembers = buildSeedTeamMembers();
  const invitations = buildSeedInvitations();
  const notifications = buildSeedNotifications();

  const userResult = await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });

  const orgResult = await prisma.organization.createMany({
    data: organizations,
    skipDuplicates: true,
  });

  const memberResult = await prisma.member.createMany({
    data: members,
    skipDuplicates: true,
  });

  const teamResult = await prisma.team.createMany({
    data: teams,
    skipDuplicates: true,
  });

  const teamMemberResult = await prisma.teamMember.createMany({
    data: teamMembers,
    skipDuplicates: true,
  });

  const invitationResult = await prisma.invitation.createMany({
    data: invitations,
    skipDuplicates: true,
  });

  const notificationResult = await prisma.notification.createMany({
    data: notifications,
    skipDuplicates: true,
  });

  console.log("Seed dev (auth schema) — done");
  console.table({
    users: userResult.count,
    organizations: orgResult.count,
    members: memberResult.count,
    teams: teamResult.count,
    teamMembers: teamMemberResult.count,
    invitations: invitationResult.count,
    notifications: notificationResult.count,
  });
  console.log(`Fake users: *@${USER_EMAIL_DOMAIN}. Clear: pnpm seed:dev:clear`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
