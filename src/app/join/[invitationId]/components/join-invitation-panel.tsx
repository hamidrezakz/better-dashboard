"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { acceptInvitationAction } from "@/app/action/join/accept-invitation-action";
import { buildAuthRouteWithRedirect } from "@/lib/auth/redirect";
import {
  joinAuthRedirectTarget,
  joinLoginPath,
} from "@/app/join/lib/join-routes";
import type { InvitationJoinPreview } from "@/app/join/lib/get-invitation-join-preview";
import { invitationJoinScopeLabels } from "@/app/join/lib/invitation-scope";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

type JoinInvitationPanelProps = {
  invitationId: string;
  preview: Extract<InvitationJoinPreview, { kind: "ok" }>;
  isAuthenticated: boolean;
  autoAccept: boolean;
};

export function JoinInvitationPanel({
  invitationId,
  preview,
  isAuthenticated,
  autoAccept,
}: JoinInvitationPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const autoAcceptStarted = useRef(false);

  const loginPath = joinLoginPath(invitationId);
  const signupPath = buildAuthRouteWithRedirect(
    "/signup",
    joinAuthRedirectTarget(invitationId),
  );

  const runAccept = () => {
    if (preview.isUnavailable) {
      return;
    }

    if (!isAuthenticated) {
      router.push(loginPath);
      return;
    }

    setError(null);

    startTransition(async () => {
      const result = await acceptInvitationAction(invitationId);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.replace(result.redirectTo);
    });
  };

  useEffect(() => {
    if (
      !autoAccept ||
      !isAuthenticated ||
      preview.isUnavailable ||
      autoAcceptStarted.current
    ) {
      return;
    }

    autoAcceptStarted.current = true;
    runAccept();
  }, [autoAccept, isAuthenticated, preview.isUnavailable]);

  const scopeLabel = invitationJoinScopeLabels[preview.scope];

  return (
    <div className="space-y-5">
      <div className="space-y-1 text-center">
        <p className="text-xs text-muted-foreground">{scopeLabel}</p>
        {preview.organization ? (
          <h1 className="text-lg font-semibold leading-snug">
            {preview.organization.name}
          </h1>
        ) : preview.team ? (
          <h1 className="text-lg font-semibold leading-snug">
            {preview.team.name}
          </h1>
        ) : null}
        {preview.team && preview.organization ? (
          <p className="text-sm text-muted-foreground">{preview.team.name}</p>
        ) : null}
      </div>

      {preview.isUnavailable ? (
        <UnavailableMessage preview={preview} />
      ) : (
        <>
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <Button
            className="w-full"
            disabled={isPending}
            onClick={runAccept}
            size="lg"
          >
            {isPending
              ? "Joining..."
              : isAuthenticated
                ? "Join"
                : "Sign in and join"}
          </Button>

          {!isAuthenticated ? (
            <p className="text-center text-xs text-muted-foreground">
              Don&apos;t have an account?{" "}
              <a
                className="text-primary underline-offset-4 hover:underline"
                href={signupPath}
              >
                Sign up
              </a>
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}

function UnavailableMessage({
  preview,
}: {
  preview: Extract<InvitationJoinPreview, { kind: "ok" }>;
}) {
  if (preview.isExpired) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        This invitation has expired.
      </p>
    );
  }

  if (preview.isExhausted) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        This invitation has reached its usage limit.
      </p>
    );
  }

  return (
    <p className="text-center text-sm text-muted-foreground">
      This invitation is no longer available.
    </p>
  );
}
