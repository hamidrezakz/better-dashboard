import type {
  NotificationAudience,
  NotificationType,
} from "@/generated/prisma/enums";
import { badgeLabels } from "@/lib/badge/badge-labels";

export const NOTIFICATION_TYPE_OPTIONS = [
  "SYSTEM",
  "INVITATION",
  "ORGANIZATION",
  "TEAM",
  "SECURITY",
  "BILLING",
  "CUSTOM",
] as const satisfies readonly NotificationType[];

export const NOTIFICATION_AUDIENCE_OPTIONS = [
  "ORG_ALL",
  "ORG_ADMINS",
  "ORG_MEMBERS",
  "USER_DIRECT",
  "TEAM",
] as const satisfies readonly NotificationAudience[];

export const notificationTypeLabels = badgeLabels.notificationType;
export const notificationAudienceLabels = badgeLabels.notificationAudience;
