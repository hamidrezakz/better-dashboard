/** Enum/badge display strings — not route navigation. See docs/agents/dashboard.md */
import {
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
  [MembershipRole.owner]: "Owner",
  [MembershipRole.admin]: "Admin",
  [MembershipRole.member]: "Member",
};

const platformRoleLabels: Record<UserRole, string> = {
  [UserRole.user]: "User",
  [UserRole.admin]: "Platform admin",
};

export const userAccountStatusLabels = {
  active: "Active",
  banned: "Banned",
} as const;

const notificationTypeLabels: Record<NotificationType, string> = {
  [NotificationType.system]: "System",
  [NotificationType.organization]: "Organization",
  [NotificationType.security]: "Security",
  [NotificationType.custom]: "Custom",
};

const notificationAudienceLabels: Record<NotificationAudience, string> = {
  [NotificationAudience.user_direct]: "User",
  [NotificationAudience.org_all]: "All organization members",
  [NotificationAudience.org_admins]: "Organization admins",
  [NotificationAudience.org_members]: "Organization members",
  [NotificationAudience.team]: "Team members",
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
