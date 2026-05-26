import { Suspense } from "react";
import { JoinInvitationCard } from "@/app/join/[invitationId]/components/join-invitation-card";
import { getInvitationJoinPreview } from "@/app/join/lib/get-invitation-join-preview";
import { getSessionCached } from "@/lib/session";
import { CardLoadingFallback } from "@/components/loading-fallback";
import { Card, CardContent } from "@/components/ui/card";

type JoinInvitationPageProps = {
  params: Promise<{
    invitationId: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function JoinInvitationPage({
  params,
  searchParams,
}: JoinInvitationPageProps) {
  return (
    <Suspense fallback={<JoinPageFallback />}>
      <JoinInvitationPageContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

function JoinPageFallback() {
  return (
    <CardLoadingFallback
      showHeader={false}
      contentClassName="min-h-48"
      label="Loading..."
    />
  );
}

async function JoinInvitationPageContent({
  params,
  searchParams,
}: JoinInvitationPageProps) {
  const [{ invitationId }, resolvedSearchParams, session] = await Promise.all([
    params,
    searchParams,
    getSessionCached(),
  ]);

  const autoAccept = resolvedSearchParams.auto === "1";
  const preview = await getInvitationJoinPreview(invitationId);

  if (preview.kind === "not_found") {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Invitation not found.
        </CardContent>
      </Card>
    );
  }

  return (
    <JoinInvitationCard
      invitationId={invitationId}
      preview={preview}
      isAuthenticated={Boolean(session?.user)}
      autoAccept={autoAccept}
    />
  );
}
