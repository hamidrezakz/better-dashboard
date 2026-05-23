import { Suspense } from "react";
import { LoadingFallback } from "@/components/loading-fallback";
import { AccountSessionsPanel } from "@/app/dashboard/(user)/account/sessions/components/account-sessions-panel";
import { getAccountSessions } from "@/app/dashboard/(user)/account/lib/get-account-sessions";
import { getSessionDeviceDisplay } from "@/app/dashboard/(user)/account/lib/format-session-device";
import {
  formatSessionExpires,
  formatSessionIpAddress,
  formatSessionSignedIn,
} from "@/app/dashboard/(user)/account/lib/format-session-meta";
import { requireAuthSession } from "@/lib/auth-session";

export default function AccountSessionsPage() {
  return (
    <Suspense fallback={<LoadingFallback className="min-h-[20vh]" />}>
      <AccountSessionsPageContent />
    </Suspense>
  );
}

async function AccountSessionsPageContent() {
  const session = await requireAuthSession();
  const sessions = await getAccountSessions();

  return (
    <AccountSessionsPanel
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
      currentSessionToken={session.session.token}
    />
  );
}
