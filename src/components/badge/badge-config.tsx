import {
  BellIcon,
  Building2Icon,
  CircleUserRoundIcon,
  CrownIcon,
  Link2Icon,
  ShieldAlertIcon,
  ShieldIcon,
  TimerOffIcon,
  UsersIcon,
  UserIcon,
} from "lucide-react";
import type { InvitationJoinScope } from "@/app/join/lib/invitation-scope";
import {
  resolveInvitationDisplayStatus,
  type InvitationDisplayInput,
} from "@/lib/badge/invitation-display-status";
import type { InvitationDisplayStatusKey } from "@/lib/badge/badge-labels";
import type {
  MembershipRole,
  NotificationAudience,
  NotificationType,
  UserRole,
} from "@/generated/prisma/enums";
import {
  type LabeledBadgeConfig,
  type LabeledBadgeVariant,
} from "@/components/badge/labeled-badge";
import { badgeLabels } from "@/lib/badge/badge-labels";
import type { ReactElement } from "react";

function item(
  label: string,
  variant: LabeledBadgeVariant,
  icon: ReactElement,
): LabeledBadgeConfig {
  return { label, variant, icon };
}

const invitationDisplayStatusConfig: Record<
  InvitationDisplayStatusKey,
  LabeledBadgeConfig
> = {
  active_link: item(
    badgeLabels.invitationDisplayStatus.active_link,
    "default",
    <Link2Icon data-icon="inline-start" />,
  ),
  expired: item(
    badgeLabels.invitationDisplayStatus.expired,
    "outline",
    <TimerOffIcon data-icon="inline-start" />,
  ),
  exhausted: item(
    badgeLabels.invitationDisplayStatus.exhausted,
    "outline",
    <UsersIcon data-icon="inline-start" />,
  ),
};

const invitationJoinScopeConfig: Record<
  InvitationJoinScope,
  LabeledBadgeConfig
> = {
  organization: item(
    badgeLabels.invitationJoinScope.organization,
    "secondary",
    <Building2Icon data-icon="inline-start" />,
  ),
  team: item(
    badgeLabels.invitationJoinScope.team,
    "outline",
    <UsersIcon data-icon="inline-start" />,
  ),
  organization_and_team: item(
    badgeLabels.invitationJoinScope.organization_and_team,
    "secondary",
    <Building2Icon data-icon="inline-start" />,
  ),
  unknown: item(
    badgeLabels.invitationJoinScope.unknown,
    "outline",
    <Link2Icon data-icon="inline-start" />,
  ),
};

const platformRoleConfig: Record<UserRole, LabeledBadgeConfig> = {
  user: item(
    badgeLabels.platformRole.user,
    "outline",
    <UserIcon data-icon="inline-start" />,
  ),
  admin: item(
    badgeLabels.platformRole.admin,
    "default",
    <ShieldIcon data-icon="inline-start" />,
  ),
};

const userAccountStatusConfig: Record<
  keyof typeof badgeLabels.userAccountStatus,
  LabeledBadgeConfig
> = {
  active: item(
    badgeLabels.userAccountStatus.active,
    "outline",
    <UserIcon data-icon="inline-start" />,
  ),
  banned: item(
    badgeLabels.userAccountStatus.banned,
    "destructive",
    <ShieldAlertIcon data-icon="inline-start" />,
  ),
};

const membershipRoleConfig: Record<MembershipRole, LabeledBadgeConfig> = {
  OWNER: item(
    badgeLabels.membershipRole.OWNER,
    "default",
    <CrownIcon data-icon="inline-start" />,
  ),
  ADMIN: item(
    badgeLabels.membershipRole.ADMIN,
    "secondary",
    <ShieldIcon data-icon="inline-start" />,
  ),
  MEMBER: item(
    badgeLabels.membershipRole.MEMBER,
    "outline",
    <UserIcon data-icon="inline-start" />,
  ),
};

const notificationTypeConfig: Record<NotificationType, LabeledBadgeConfig> = {
  SYSTEM: item(
    badgeLabels.notificationType.SYSTEM,
    "default",
    <BellIcon data-icon="inline-start" />,
  ),
  ORGANIZATION: item(
    badgeLabels.notificationType.ORGANIZATION,
    "secondary",
    <Building2Icon data-icon="inline-start" />,
  ),
  SECURITY: item(
    badgeLabels.notificationType.SECURITY,
    "destructive",
    <ShieldAlertIcon data-icon="inline-start" />,
  ),
  CUSTOM: item(
    badgeLabels.notificationType.CUSTOM,
    "outline",
    <BellIcon data-icon="inline-start" />,
  ),
};

const notificationAudienceConfig: Record<
  NotificationAudience,
  LabeledBadgeConfig
> = {
  USER_DIRECT: item(
    badgeLabels.notificationAudience.USER_DIRECT,
    "default",
    <CircleUserRoundIcon data-icon="inline-start" />,
  ),
  ORG_ALL: item(
    badgeLabels.notificationAudience.ORG_ALL,
    "secondary",
    <Building2Icon data-icon="inline-start" />,
  ),
  ORG_ADMINS: item(
    badgeLabels.notificationAudience.ORG_ADMINS,
    "secondary",
    <ShieldIcon data-icon="inline-start" />,
  ),
  ORG_MEMBERS: item(
    badgeLabels.notificationAudience.ORG_MEMBERS,
    "secondary",
    <UsersIcon data-icon="inline-start" />,
  ),
  TEAM: item(
    badgeLabels.notificationAudience.TEAM,
    "outline",
    <UsersIcon data-icon="inline-start" />,
  ),
};

function resolveConfig<T extends string>(
  value: string,
  config: Record<T, LabeledBadgeConfig>,
  fallbackIcon: ReactElement,
): LabeledBadgeConfig {
  const normalizedValue = value.trim();
  const matched = config[normalizedValue as T];

  if (matched) {
    return matched;
  }

  return {
    label: normalizedValue || badgeLabels.fallback,
    variant: "outline",
    icon: fallbackIcon,
  };
}

export function getInvitationDisplayStatusBadgeConfig(
  invitation: InvitationDisplayInput,
) {
  const displayStatus = resolveInvitationDisplayStatus(invitation);
  return invitationDisplayStatusConfig[displayStatus];
}

export function getInvitationJoinScopeBadgeConfig(
  scope: InvitationJoinScope | string,
) {
  return resolveConfig(
    scope,
    invitationJoinScopeConfig,
    <Link2Icon data-icon="inline-start" />,
  );
}

export function getNotificationTypeBadgeConfig(type: string) {
  return resolveConfig(
    type,
    notificationTypeConfig,
    <BellIcon data-icon="inline-start" />,
  );
}

export function getRoleBadgeConfig(role: string) {
  return resolveConfig(
    role,
    membershipRoleConfig,
    <UserIcon data-icon="inline-start" />,
  );
}

export function getPlatformRoleBadgeConfig(role: string) {
  return resolveConfig(
    role,
    platformRoleConfig,
    <UserIcon data-icon="inline-start" />,
  );
}

export function getUserAccountStatusBadgeConfig(
  status: keyof typeof badgeLabels.userAccountStatus,
) {
  return userAccountStatusConfig[status];
}

export function getVisibilityBadgeConfig(visibility: string) {
  return resolveConfig(
    visibility,
    notificationAudienceConfig,
    <UsersIcon data-icon="inline-start" />,
  );
}

export function getNotificationAudienceBadgeConfig(audience: string) {
  return resolveConfig(
    audience,
    notificationAudienceConfig,
    <UsersIcon data-icon="inline-start" />,
  );
}
