import { Suspense } from "react";
import { LoadingFallback } from "@/components/loading-fallback";
import { AccountSessionsPanel } from "@/app/dashboard/(user)/account/sessions/components/account-sessions-panel";
import { getAccountSessions } from "@/app/dashboard/(user)/account/lib/get-account-sessions";
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
      sessions={sessions.map((row) => ({
        id: row.id,
        token: row.token,
        createdAt: row.createdAt.toISOString(),
        expiresAt: row.expiresAt.toISOString(),
        ipAddress: row.ipAddress,
        userAgent: row.userAgent,
      }))}
      currentSessionToken={session.session.token}
    />
  );
}
