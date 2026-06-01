/** Enum/badge display strings — not route navigation. See docs/agents/dashboard.md */

import {
  MembershipRole,
  NotificationAudience,
  NotificationType,
  UserRole,
} from "@/generated/prisma/enums";

const invitationDisplayStatusLabels = {
  active_link: "فعال",

  expired: "منقضی‌شده",

  exhausted: "ظرفیت تکمیل",
} as const;

const invitationJoinScopeLabels = {
  organization: "سازمان",

  team: "تیم",

  organization_and_team: "سازمان و تیم",

  unknown: "نامشخص",
} as const;

const membershipRoleLabels: Record<MembershipRole, string> = {
  [MembershipRole.owner]: "مالک",

  [MembershipRole.admin]: "مدیر",

  [MembershipRole.member]: "عضو",
};

const platformRoleLabels: Record<UserRole, string> = {
  [UserRole.user]: "کاربر",

  [UserRole.admin]: "مدیر پلتفرم",
};

export const userAccountStatusLabels = {
  active: "فعال",

  banned: "مسدود",
} as const;

const notificationTypeLabels: Record<NotificationType, string> = {
  [NotificationType.system]: "سیستم",

  [NotificationType.organization]: "سازمان",

  [NotificationType.security]: "امنیت",

  [NotificationType.custom]: "سفارشی",
};

const notificationAudienceLabels: Record<NotificationAudience, string> = {
  [NotificationAudience.user_direct]: "کاربر",

  [NotificationAudience.org_all]: "همه اعضای سازمان",

  [NotificationAudience.org_admins]: "مدیران سازمان",

  [NotificationAudience.org_members]: "اعضای سازمان",

  [NotificationAudience.team]: "اعضای تیم",
};

export const badgeLabels = {
  fallback: "نامشخص",

  invitationDisplayStatus: invitationDisplayStatusLabels,

  invitationJoinScope: invitationJoinScopeLabels,

  membershipRole: membershipRoleLabels,

  platformRole: platformRoleLabels,

  userAccountStatus: userAccountStatusLabels,

  notificationType: notificationTypeLabels,

  notificationAudience: notificationAudienceLabels,
} as const;

export type InvitationDisplayStatusKey =
  keyof typeof invitationDisplayStatusLabels;
