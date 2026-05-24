"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronRightIcon } from "lucide-react";
import { AccountPasswordFormShell } from "@/app/dashboard/(user)/account/components/account-password-form-shell";
import { AccountProfileFormShell } from "@/app/dashboard/(user)/account/components/account-profile-form-shell";
import type { AccountSessionDisplay } from "@/app/dashboard/(user)/account/components/account-sessions-content";
import { AccountSessionsFormShell } from "@/app/dashboard/(user)/account/components/account-sessions-form-shell";
import {
  accountListSettingsItems,
  isAccountSettingsSection,
} from "@/app/dashboard/(user)/account/lib/account-settings-items";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import type { AccountSettingsSection } from "@/app/dashboard/lib/dashboard-routes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type AccountSettingsHubProps = {
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
  profile,
  hasPasswordCredential,
  sessions,
  currentSessionToken,
}: AccountSettingsHubProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openSection, setOpenSection] = useState<AccountSettingsSection | null>(
    null,
  );

  const clearSectionParam = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (!params.has("section")) {
      return;
    }
    params.delete("section");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [pathname, router, searchParams]);

  const closeSection = useCallback(() => {
    setOpenSection(null);
    clearSectionParam();
  }, [clearSectionParam]);

  const openSectionPanel = useCallback(
    (section: AccountSettingsSection) => {
      setOpenSection(section);
      const params = new URLSearchParams(searchParams.toString());
      params.set("section", section);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    const section = searchParams.get("section");
    if (isAccountSettingsSection(section)) {
      setOpenSection(section);
    }
  }, [searchParams]);

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
