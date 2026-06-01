import {
  NotificationAudience,
  NotificationType,
} from "@/generated/prisma/enums";
import { badgeLabels } from "@/lib/badge/badge-labels";

export const NOTIFICATION_TYPE_OPTIONS = [
  NotificationType.system,
  NotificationType.organization,
  NotificationType.security,
  NotificationType.custom,
] as const satisfies readonly NotificationType[];

export const NOTIFICATION_AUDIENCE_OPTIONS = [
  NotificationAudience.org_all,
  NotificationAudience.org_admins,
  NotificationAudience.org_members,
  NotificationAudience.user_direct,
  NotificationAudience.team,
] as const satisfies readonly NotificationAudience[];

export const notificationTypeLabels = badgeLabels.notificationType;
export const notificationAudienceLabels = badgeLabels.notificationAudience;
