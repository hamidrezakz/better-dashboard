import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AccountSettingsHub } from "@/app/dashboard/(user)/account/components/account-settings-hub";
import { AccountHubFallback } from "@/app/dashboard/(user)/account/components/account-hub-fallback";
import { getAccountProfile } from "@/app/dashboard/(user)/account/lib/get-account-profile";
import { getAccountSessions } from "@/app/dashboard/(user)/account/lib/get-account-sessions";
import { getSessionDeviceDisplay } from "@/app/dashboard/(user)/account/lib/format-session-device";
import {
  formatSessionExpires,
  formatSessionIpAddress,
  formatSessionSignedIn,
} from "@/app/dashboard/(user)/account/lib/format-session-meta";
import { getUserHasPasswordCredential } from "@/app/dashboard/(user)/account/lib/get-user-has-password-credential";
import { requireAuthSession } from "@/lib/auth-session";

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountHubFallback />}>
      <AccountSettingsHubContent />
    </Suspense>
  );
}

async function AccountSettingsHubContent() {
  const session = await requireAuthSession();
  const [profile, hasPasswordCredential, sessions] = await Promise.all([
    getAccountProfile(session.user.id),
    getUserHasPasswordCredential(session.user.id),
    getAccountSessions(),
  ]);

  if (!profile) {
    notFound();
  }

  return (
    <Suspense fallback={<AccountHubFallback />}>
      <AccountSettingsHub
        profile={profile}
        hasPasswordCredential={hasPasswordCredential}
        currentSessionToken={session.session.token}
        sessions={sessions.map((row) => {
          const device = getSessionDeviceDisplay(row.userAgent);
          const createdAt = row.createdAt.toISOString();
          const expiresAt = row.expiresAt.toISOString();
          const ip = formatSessionIpAddress(row.ipAddress);

          return {
            id: row.id,
            token: row.token,
            device,
            signedInLabel: formatSessionSignedIn(createdAt),
            expiresLabel: formatSessionExpires(expiresAt),
            ipLabel: ip,
          };
        })}
      />
    </Suspense>
  );
}
