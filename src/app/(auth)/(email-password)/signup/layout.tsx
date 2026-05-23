import { Suspense } from "react";
import Link from "next/link";
import { AuthCrossLink } from "@/app/(auth)/components/auth-cross-link";
import { buildAuthRouteWithRedirect } from "@/lib/auth-redirect";

type SignUpLayoutProps = {
  children: React.ReactNode;
};

export default function SignUpLayout({ children }: SignUpLayoutProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="mb-6 flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold">Sign up</h1>
        <p className="text-sm text-muted-foreground">
          Create your account in one step.
        </p>
      </div>
      {children}
      <div className="px-2 text-center text-sm">
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <Suspense
            fallback={
              <Link
                className="font-medium text-primary"
                href={buildAuthRouteWithRedirect("/login", "/dashboard")}>
                Sign in
              </Link>
            }>
            <AuthCrossLink className="font-medium text-primary" target="/login">
              Sign in
            </AuthCrossLink>
          </Suspense>
        </p>
      </div>
    </div>
  );
}
