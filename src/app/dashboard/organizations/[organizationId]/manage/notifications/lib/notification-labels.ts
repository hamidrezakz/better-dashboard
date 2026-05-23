import type {
  NotificationAudience,
  NotificationType,
} from "@/generated/prisma/enums";
import { badgeTranslations } from "@/lib/i18n/badge-translations";

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

export const notificationTypeLabels = badgeTranslations.notificationType;
export const notificationAudienceLabels =
  badgeTranslations.notificationAudience;
