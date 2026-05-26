"use client";

import { useState } from "react";
import { ChevronRightIcon } from "lucide-react";
import { AccountSettingsPanel } from "@/app/dashboard/(user)/account/components/account-settings-panel";
import type { AccountSessionDisplay } from "@/app/dashboard/(user)/account/components/account-sessions-content";
import { accountListSettingsItems } from "@/app/dashboard/(user)/account/lib/account-settings-items";
import type { AccountPanel } from "@/app/dashboard/(user)/account/lib/account-panel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserInitials } from "@/lib/user-profile/user-display";
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
  const [openSection, setOpenSection] = useState<AccountPanel | null>(null);
  const previewImage = profile.image ?? "";

  return (
    <>
      <div className="w-full max-w-xl space-y-6">
        <button
          type="button"
          className={settingsRowClassName()}
          onClick={() => setOpenSection("profile")}
        >
          <Avatar className="size-12">
            <AvatarImage src={previewImage} alt={profile.name} />
            <AvatarFallback>
              {getUserInitials(profile.name, "??")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 text-start">
            <p className="truncate text-sm font-medium">{profile.name}</p>
            <p className="truncate text-sm text-muted-foreground">
              {profile.email}
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
              onClick={() => setOpenSection(item.key)}
            >
              <div className="min-w-0 flex-1 text-start">
                <p className="text-sm font-medium">{item.label}</p>
              </div>
              <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      <AccountSettingsPanel
        section={openSection}
        onClose={() => setOpenSection(null)}
        profile={profile}
        hasPasswordCredential={hasPasswordCredential}
        sessions={sessions}
        currentSessionToken={currentSessionToken}
      />
    </>
  );
}

function settingsRowClassName() {
  return cn(
    "flex w-full items-center gap-4 rounded-lg border px-4 py-3 text-start transition-colors",
    "hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
  );
}
