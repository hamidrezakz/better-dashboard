"use client";

import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronRightIcon } from "lucide-react";
import { AccountPasswordFormShell } from "@/app/dashboard/(user)/account/components/account-password-form-shell";
import { AccountProfileFormShell } from "@/app/dashboard/(user)/account/components/account-profile-form-shell";
import type { AccountSessionDisplay } from "@/app/dashboard/(user)/account/components/account-sessions-content";
import { AccountSessionsFormShell } from "@/app/dashboard/(user)/account/components/account-sessions-form-shell";
import {
  accountListSettingsItems,
  writeAccountSectionToUrl,
} from "@/app/dashboard/(user)/account/lib/account-settings-items";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import type { AccountSettingsSection } from "@/app/dashboard/lib/dashboard-routes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type AccountSettingsHubProps = {
  initialSection: AccountSettingsSection | null;
  profile: {
    name: string;
    email: string;
    image: string | null;
  };
  hasPasswordCredential: boolean;
  sessions: AccountSessionDisplay[];
  currentSessionToken: string;
};

export function AccountSettingsHub({
  initialSection,
  profile,
  hasPasswordCredential,
  sessions,
  currentSessionToken,
}: AccountSettingsHubProps) {
  const pathname = usePathname();
  const [openSection, setOpenSection] = useState<AccountSettingsSection | null>(
    initialSection,
  );

  const closeSection = useCallback(() => {
    setOpenSection(null);
    writeAccountSectionToUrl(pathname, null);
  }, [pathname]);

  const openSectionPanel = useCallback(
    (section: AccountSettingsSection) => {
      setOpenSection(section);
      writeAccountSectionToUrl(pathname, section);
    },
    [pathname],
  );

  const previewImage = profile.image ?? "";

  return (
    <>
      <div className="w-full max-w-xl space-y-6">
        <button
          type="button"
          className={settingsRowClassName()}
          onClick={() => openSectionPanel("profile")}
        >
          <Avatar className="size-12">
            <AvatarImage src={previewImage} alt={profile.name} />
            <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 text-start">
            <p className="truncate text-sm font-medium">{profile.name}</p>
            <p className="truncate text-sm text-muted-foreground">
              {profile.email}
            </p>
            <p className="pt-0.5 text-xs text-muted-foreground">
              {dashboardNavLabels.accountSettings.editProfile}
            </p>
          </div>
          <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
        </button>

        <div className="divide-y rounded-lg border">
          {accountListSettingsItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={cn(settingsRowClassName(), "rounded-none border-0")}
              onClick={() => openSectionPanel(item.key)}
            >
              <div className="min-w-0 flex-1 text-start">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {openSection === "profile" ? (
        <AccountProfileFormShell
          profile={profile}
          open
          onClose={closeSection}
        />
      ) : null}
      {openSection === "security" ? (
        <AccountPasswordFormShell
          hasPasswordCredential={hasPasswordCredential}
          open
          onClose={closeSection}
        />
      ) : null}
      {openSection === "sessions" ? (
        <AccountSessionsFormShell
          sessions={sessions}
          currentSessionToken={currentSessionToken}
          open
          onClose={closeSection}
        />
      ) : null}
    </>
  );
}

function settingsRowClassName() {
  return cn(
    "flex w-full items-center gap-4 rounded-lg border px-4 py-3 text-start transition-colors",
    "hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) {
    return "??";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}
