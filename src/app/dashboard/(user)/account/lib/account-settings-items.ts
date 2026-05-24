import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import type { AccountSettingsSection } from "@/app/dashboard/lib/dashboard-routes";

export type AccountListSection = Exclude<AccountSettingsSection, "profile">;

export const accountListSettingsItems: ReadonlyArray<{
  key: AccountListSection;
  label: string;
  description: string;
}> = [
  {
    key: "security",
    label: dashboardNavLabels.accountSettings.security,
    description: dashboardNavLabels.accountSettings.securityDescription,
  },
  {
    key: "sessions",
    label: dashboardNavLabels.accountSettings.sessions,
    description: dashboardNavLabels.accountSettings.sessionsDescription,
  },
] as const;

export function isAccountSettingsSection(
  value: string | null | undefined,
): value is AccountSettingsSection {
  return value === "profile" || value === "security" || value === "sessions";
}
