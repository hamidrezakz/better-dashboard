/** Enum/badge display strings — not route navigation. See docs/agents/dashboard.md */
import type {
  MembershipRole,
  NotificationAudience,
  NotificationType,
} from "@/generated/prisma/enums";

const invitationDisplayStatusTranslations = {
  active_link: "فعال",
  expired: "منقضی",
  exhausted: "ظرفیت تکمیل",
} as const;

const invitationJoinScopeTranslations = {
  organization: "سازمان",
  team: "تیم",
  organization_and_team: "سازمان و تیم",
  unknown: "نامشخص",
} as const;

const membershipRoleTranslations: Record<MembershipRole, string> = {
  OWNER: "مالک",
  ADMIN: "مدیر",
  MEMBER: "عضو",
};

const notificationTypeTranslations: Record<NotificationType, string> = {
  SYSTEM: "سیستمی",
  INVITATION: "دعوت",
  ORGANIZATION: "سازمانی",
  TEAM: "تیمی",
  SECURITY: "امنیتی",
  BILLING: "صورتحساب",
  CUSTOM: "سفارشی",
};

const notificationAudienceTranslations: Record<NotificationAudience, string> = {
  USER_DIRECT: "کاربر",
  ORG_ALL: "همه اعضای سازمان",
  ORG_ADMINS: "مدیران سازمان",
  ORG_MEMBERS: "اعضای سازمان",
  TEAM: "اعضای تیم",
};

export const badgeTranslations = {
  fallback: "نامشخص",
  invitationDisplayStatus: invitationDisplayStatusTranslations,
  invitationJoinScope: invitationJoinScopeTranslations,
  membershipRole: membershipRoleTranslations,
  notificationType: notificationTypeTranslations,
  notificationAudience: notificationAudienceTranslations,
} as const;

export type InvitationDisplayStatusKey =
  keyof typeof invitationDisplayStatusTranslations;
