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
import {
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
  [UserRole.user]: item(
    badgeLabels.platformRole[UserRole.user],
    "outline",
    <UserIcon data-icon="inline-start" />,
  ),
  [UserRole.admin]: item(
    badgeLabels.platformRole[UserRole.admin],
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
  [MembershipRole.owner]: item(
    badgeLabels.membershipRole[MembershipRole.owner],
    "default",
    <CrownIcon data-icon="inline-start" />,
  ),
  [MembershipRole.admin]: item(
    badgeLabels.membershipRole[MembershipRole.admin],
    "secondary",
    <ShieldIcon data-icon="inline-start" />,
  ),
  [MembershipRole.member]: item(
    badgeLabels.membershipRole[MembershipRole.member],
    "outline",
    <UserIcon data-icon="inline-start" />,
  ),
};

const notificationTypeConfig: Record<NotificationType, LabeledBadgeConfig> = {
  [NotificationType.system]: item(
    badgeLabels.notificationType[NotificationType.system],
    "default",
    <BellIcon data-icon="inline-start" />,
  ),
  [NotificationType.organization]: item(
    badgeLabels.notificationType[NotificationType.organization],
    "secondary",
    <Building2Icon data-icon="inline-start" />,
  ),
  [NotificationType.security]: item(
    badgeLabels.notificationType[NotificationType.security],
    "destructive",
    <ShieldAlertIcon data-icon="inline-start" />,
  ),
  [NotificationType.custom]: item(
    badgeLabels.notificationType[NotificationType.custom],
    "outline",
    <BellIcon data-icon="inline-start" />,
  ),
};

const notificationAudienceConfig: Record<
  NotificationAudience,
  LabeledBadgeConfig
> = {
  [NotificationAudience.user_direct]: item(
    badgeLabels.notificationAudience[NotificationAudience.user_direct],
    "default",
    <CircleUserRoundIcon data-icon="inline-start" />,
  ),
  [NotificationAudience.org_all]: item(
    badgeLabels.notificationAudience[NotificationAudience.org_all],
    "secondary",
    <Building2Icon data-icon="inline-start" />,
  ),
  [NotificationAudience.org_admins]: item(
    badgeLabels.notificationAudience[NotificationAudience.org_admins],
    "secondary",
    <ShieldIcon data-icon="inline-start" />,
  ),
  [NotificationAudience.org_members]: item(
    badgeLabels.notificationAudience[NotificationAudience.org_members],
    "secondary",
    <UsersIcon data-icon="inline-start" />,
  ),
  [NotificationAudience.team]: item(
    badgeLabels.notificationAudience[NotificationAudience.team],
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
