"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  buildAuthRouteWithRedirect,
  normalizeAuthRedirectTarget,
} from "@/lib/auth-redirect";

type AuthCrossLinkProps = {
  target: "/login" | "/signup";
  children: React.ReactNode;
  className?: string;
};

export function AuthCrossLink({
  target,
  children,
  className,
}: AuthCrossLinkProps) {
  const searchParams = useSearchParams();
  const href = buildAuthRouteWithRedirect(
    target,
    normalizeAuthRedirectTarget(searchParams.get("redirect")),
  );

  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}
