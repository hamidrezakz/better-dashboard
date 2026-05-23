import { Suspense } from "react";
import { LoadingFallback } from "@/components/loading-fallback";
import { DashboardTableCardFallback } from "@/app/dashboard/components/dashboard-page-fallbacks";
import { DashboardPageShell } from "@/app/dashboard/components/dashboard-page-shell";
import { requireAuthSession } from "@/lib/auth-session";
import { UserNotificationsPanel } from "@/app/dashboard/users/[userId]/notifications/components/user-notifications-panel";
import {
  getUserNotificationsPage,
  parseUserNotificationsPageQuery,
} from "@/app/dashboard/users/[userId]/notifications/lib/get-user-notifications-page";

type UserNotificationsPageProps = {
  params: Promise<{
    userId: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function UserNotificationsPage({
  params,
  searchParams,
}: UserNotificationsPageProps) {
  const { userId } = await params;

  return (
    <DashboardPageShell>
      <Suspense fallback={<LoadingFallback className="min-h-[12vh]" />}>
        <UserNotificationsPageIntro userId={userId} />
      </Suspense>

      <Suspense fallback={<DashboardTableCardFallback />}>
        <UserNotificationsPagePanel
          userId={userId}
          searchParams={searchParams}
        />
      </Suspense>
    </DashboardPageShell>
  );
}

async function UserNotificationsPageIntro({ userId }: { userId: string }) {
  const session = await requireAuthSession();
  const isOwnInbox = session.user.id === userId;

  return (
    <div>
      <h1 className="text-base font-semibold">اعلان‌ها</h1>
      <p className="text-sm text-muted-foreground">
        {isOwnInbox
          ? "همه اعلان‌های مربوط به حساب شما، سازمان‌ها و تیم‌ها."
          : "اعلان‌های مربوط به این کاربر در سازمان‌ها و تیم‌ها."}
      </p>
    </div>
  );
}

async function UserNotificationsPagePanel({
  userId,
  searchParams,
}: {
  userId: string;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await requireAuthSession();
  const isOwnInbox = session.user.id === userId;

  const resolvedSearchParams = await searchParams;
  const query = parseUserNotificationsPageQuery(resolvedSearchParams);
  const data = await getUserNotificationsPage(userId, query);

  return (
    <UserNotificationsPanel
      userId={userId}
      isOwnInbox={isOwnInbox}
      canMarkRead={isOwnInbox}
      notifications={data.notifications}
      page={data.page}
      pageSize={data.pageSize}
      totalCount={data.totalCount}
      filter={data.filter}
    />
  );
}
