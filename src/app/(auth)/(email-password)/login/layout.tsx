import { Suspense } from "react";
import Link from "next/link";
import { authRoutes } from "@/app/(auth)/lib/auth-routes";
import { AuthCrossLink } from "@/app/(auth)/components/auth-cross-link";
import { buildAuthRouteWithRedirect } from "@/lib/auth/redirect";

type LoginLayoutProps = {
  children: React.ReactNode;
};

export default function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="mb-6 flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold">ورود</h1>
        <p className="text-sm text-muted-foreground">
          با ایمیل و رمز عبور وارد شوید.
        </p>
      </div>
      {children}
      <div className="px-2 text-center text-sm">
        <p className="text-muted-foreground">
          حساب ندارید؟{" "}
          <Suspense
            fallback={
              <Link
                className="font-medium text-primary"
                href={buildAuthRouteWithRedirect(
                  authRoutes.signup(),
                  "/dashboard",
                )}
              >
                ثبت‌نام
              </Link>
            }
          >
            <AuthCrossLink
              className="font-medium text-primary"
              target={authRoutes.signup()}
            >
              ثبت‌نام
            </AuthCrossLink>
          </Suspense>
        </p>
      </div>
    </div>
  );
}
