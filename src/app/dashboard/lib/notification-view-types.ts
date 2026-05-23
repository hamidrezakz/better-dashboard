import type {
  NotificationAudience,
  NotificationType,
} from "@/generated/prisma/enums";

export type NotificationViewItem = {
  id: string;
  title: string;
  body: string | null;
  type: NotificationType;
  audience: NotificationAudience;
  createdAt: string;
  readAt?: string | null;
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
  teamName?: string | null;
  organizationName?: string | null;
  createdByName?: string | null;
  sourceLabel?: string | null;
};
