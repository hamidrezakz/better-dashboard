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
        <h1 className="text-2xl font-semibold">ثبت نام</h1>
        <p className="text-sm text-muted-foreground">
          حساب کاربری خود را در یک مرحله ایجاد کنید.
        </p>
      </div>
      {children}
      <div className="px-2 text-center text-sm">
        <p className="text-muted-foreground">
          از قبل حساب کاربری دارید؟{" "}
          <Suspense
            fallback={
              <Link
                className="font-medium text-primary"
                href={buildAuthRouteWithRedirect("/login", "/dashboard")}>
                ورود
              </Link>
            }>
            <AuthCrossLink className="font-medium text-primary" target="/login">
              ورود
            </AuthCrossLink>
          </Suspense>
        </p>
      </div>
    </div>
  );
}
