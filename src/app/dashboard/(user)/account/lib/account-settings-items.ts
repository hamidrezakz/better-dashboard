import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import type { AccountListPanel } from "@/app/dashboard/(user)/account/lib/account-panel";

export const accountListSettingsItems: ReadonlyArray<{
  key: AccountListPanel;
  label: string;
}> = [
  {
    key: "security",
    label: dashboardNavLabels.accountSettings.security,
  },
  {
    key: "sessions",
    label: dashboardNavLabels.accountSettings.sessions,
  },
] as const;
