/** Enum/badge display strings — not route navigation. See docs/agents/dashboard.md */
import type {
  MembershipRole,
  NotificationAudience,
  NotificationType,
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

const notificationTypeLabels: Record<NotificationType, string> = {
  SYSTEM: "System",
  INVITATION: "Invitation",
  ORGANIZATION: "Organization",
  TEAM: "Team",
  SECURITY: "Security",
  BILLING: "Billing",
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
  notificationType: notificationTypeLabels,
  notificationAudience: notificationAudienceLabels,
} as const;

export type InvitationDisplayStatusKey =
  keyof typeof invitationDisplayStatusLabels;
