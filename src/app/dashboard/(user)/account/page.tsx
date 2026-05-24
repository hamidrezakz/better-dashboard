import { notFound } from "next/navigation";
import { AccountSettingsHub } from "@/app/dashboard/(user)/account/components/account-settings-hub";
import { mapAccountSessionsForDisplay } from "@/app/dashboard/(user)/account/lib/account-session-display";
import { getAccountProfile } from "@/app/dashboard/(user)/account/lib/get-account-profile";
import { getAccountSessions } from "@/app/dashboard/(user)/account/lib/get-account-sessions";
import { getUserHasPasswordCredential } from "@/app/dashboard/(user)/account/lib/get-user-has-password-credential";
import { requireAuthSession } from "@/lib/auth-session";

export default async function AccountPage() {
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
    <AccountSettingsHub
      profile={profile}
      hasPasswordCredential={hasPasswordCredential}
      currentSessionToken={session.session.token}
      sessions={mapAccountSessionsForDisplay(sessions)}
    />
  );
}
