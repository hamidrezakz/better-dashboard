import { buildAuthRouteWithRedirect } from "@/lib/auth/redirect";
import { toAbsolutePublicUrl } from "@/lib/public-url";

function encodeRouteSegment(value: string) {
  return encodeURIComponent(value);
}

export const joinRoutes = {
  invitation: (invitationId: string) =>
    `/join/${encodeRouteSegment(invitationId)}`,
  invitationWithAutoAccept: (invitationId: string) =>
    `/join/${encodeRouteSegment(invitationId)}?auto=1`,
  invitationAbsolute: (invitationId: string) =>
    toAbsolutePublicUrl(joinRoutes.invitation(invitationId)),
} as const;

export function joinAuthRedirectTarget(invitationId: string) {
  return joinRoutes.invitationWithAutoAccept(invitationId);
}

export function joinLoginPath(invitationId: string) {
  return buildAuthRouteWithRedirect(
    "/login",
    joinAuthRedirectTarget(invitationId),
  );
}
