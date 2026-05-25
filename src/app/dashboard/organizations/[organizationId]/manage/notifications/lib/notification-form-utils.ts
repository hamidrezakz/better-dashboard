import type { UserSearchOption } from "@/app/action/dashboard/users/search-users-action";
import type {
  NotificationAudience,
  NotificationType,
} from "@/generated/prisma/enums";

export const NOTIFICATIONS_DEFAULT_PAGE_SIZE = 10;

export type OrganizationNotificationItem = {
  id: string;
  title: string;
  body: string | null;
  type: NotificationType;
  audience: NotificationAudience;
  createdAt: string;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  userImage: string | null;
  teamId: string | null;
  teamName: string | null;
};

export type NotificationFormState = {
  title: string;
  body: string;
  type: NotificationType;
  audience: NotificationAudience;
  selectedUser: UserSearchOption | null;
  teamId: string;
};

export function getDefaultNotificationFormState(): NotificationFormState {
  return {
    title: "",
    body: "",
    type: "ORGANIZATION",
    audience: "ORG_ALL",
    selectedUser: null,
    teamId: "",
  };
}

export function audienceNeedsUser(audience: NotificationAudience) {
  return audience === "USER_DIRECT";
}

export function audienceNeedsTeam(audience: NotificationAudience) {
  return audience === "TEAM";
}

export function isNotificationFormValid(form: NotificationFormState) {
  if (!form.title.trim()) {
    return false;
  }

  if (audienceNeedsUser(form.audience) && !form.selectedUser) {
    return false;
  }

  if (audienceNeedsTeam(form.audience) && !form.teamId) {
    return false;
  }

  return true;
}

export { buildDashboardTablePageNumbers as buildPageNumbers } from "@/lib/dashboard-table-pagination";
