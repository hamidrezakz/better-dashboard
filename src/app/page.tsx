import Link from "next/link";
import { authRoutes } from "@/app/(auth)/lib/auth-routes";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <div className="flex max-w-md flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">داشبورد بهتر</h1>
        <p className="text-sm text-muted-foreground">
          قالب داشبورد احراز هویت و سازمان موبایل‌اول — سایدبار، فرم‌ها و رابط
          کاربری واکنش‌گرا برای موبایل. برای ورود به داشبورد وارد شوید یا مسیرها
          را در <code className="text-xs">src/app/dashboard</code> گسترش دهید.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href={authRoutes.login()}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          ورود
        </Link>
        <Link
          href={dashboardRoutes.home()}
          className="inline-flex h-10 items-center justify-center rounded-md border border-border px-4 text-sm font-medium hover:bg-muted"
        >
          داشبورد
        </Link>
      </div>
    </main>
  );
}
