/** Enum/badge display strings — not route navigation. See docs/agents/dashboard.md */
import type {
  MembershipRole,
  NotificationAudience,
  NotificationType,
  UserRole,
} from "@/generated/prisma/enums";

const invitationDisplayStatusLabels = {
  active_link: "Active",
  expired: "Expired",
  exhausted: "Capacity full",
} as const;

const invitationJoinScopeLabels = {
  organization: "Organization",
  team: "Team",
  organization_and_team: "Organization and team",
  unknown: "Unknown",
} as const;

const membershipRoleLabels: Record<MembershipRole, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  MEMBER: "Member",
};

const platformRoleLabels: Record<UserRole, string> = {
  user: "User",
  admin: "Platform admin",
};

export const userAccountStatusLabels = {
  active: "Active",
  banned: "Banned",
} as const;

const notificationTypeLabels: Record<NotificationType, string> = {
  SYSTEM: "System",
  ORGANIZATION: "Organization",
  SECURITY: "Security",
  CUSTOM: "Custom",
};

const notificationAudienceLabels: Record<NotificationAudience, string> = {
  USER_DIRECT: "User",
  ORG_ALL: "All organization members",
  ORG_ADMINS: "Organization admins",
  ORG_MEMBERS: "Organization members",
  TEAM: "Team members",
};

export const badgeLabels = {
  fallback: "Unknown",
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
