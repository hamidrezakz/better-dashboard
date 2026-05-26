import type { Prisma } from "@/generated/prisma/client";
import {
  NotificationAudience,
  NotificationType,
} from "@/generated/prisma/enums";
import {
  NOTIFICATION_COUNT,
  ORGANIZATIONS,
  OWNER_USER_ID,
  fakeUserId,
  teamId,
} from "../config";

const TYPES: NotificationType[] = [
  NotificationType.SYSTEM,
  NotificationType.ORGANIZATION,
  NotificationType.SECURITY,
  NotificationType.CUSTOM,
];

const AUDIENCES: NotificationAudience[] = [
  NotificationAudience.USER_DIRECT,
  NotificationAudience.ORG_ALL,
  NotificationAudience.ORG_ADMINS,
  NotificationAudience.ORG_MEMBERS,
  NotificationAudience.TEAM,
];

const TITLES = [
  "New invitation",
  "New member joined the organization",
  "Settings updated",
  "Security reminder",
  "System message",
  "Team activity",
];

export function buildSeedNotifications(): Prisma.NotificationCreateManyInput[] {
  const rows: Prisma.NotificationCreateManyInput[] = [];
  const now = Date.now();

  for (let i = 0; i < NOTIFICATION_COUNT; i++) {
    const audience = AUDIENCES[i % AUDIENCES.length];
    const orgIndex = i % 2;
    const org = ORGANIZATIONS[orgIndex];
    const isDirect = audience === NotificationAudience.USER_DIRECT;
    const read = i % 4 === 0;

    rows.push({
      id: `seed_notif_${String(i).padStart(3, "0")}`,
      type: TYPES[i % TYPES.length],
      audience,
      title: TITLES[i % TITLES.length],
      body: `Sample notification body #${i + 1} for dashboard testing.`,
      payload: { seed: true, index: i },
      userId: isDirect ? OWNER_USER_ID : null,
      createdById:
        i % 6 === 0 ? fakeUserId(1) : i % 3 === 0 ? OWNER_USER_ID : null,
      organizationId:
        audience === NotificationAudience.USER_DIRECT && i % 2 === 0
          ? null
          : org.id,
      teamId:
        audience === NotificationAudience.TEAM
          ? teamId(orgIndex, i % 3)
          : i % 9 === 0
            ? teamId(orgIndex, 0)
            : null,
      createdAt: new Date(now - (NOTIFICATION_COUNT - i) * 1_200_000),
      updatedAt: new Date(now - (NOTIFICATION_COUNT - i) * 600_000),
      expiresAt: i % 10 === 0 ? new Date(now + 30 * 86_400_000) : null,
      readAt: read ? new Date(now - i * 600_000) : null,
    });
  }

  return rows;
}
