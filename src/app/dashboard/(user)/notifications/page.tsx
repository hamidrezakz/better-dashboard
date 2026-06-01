import { Suspense } from "react";
import {
  DashboardPageTitleFallback,
  DashboardTableCardFallback,
} from "@/app/dashboard/components/dashboard-page-shell/dashboard-page-fallbacks";
import { DashboardPageShell } from "@/app/dashboard/components/dashboard-page-shell/dashboard-page-shell";
import { UserNotificationsPanel } from "@/app/dashboard/(user)/notifications/components/user-notifications-panel";
import {
  getUserNotificationsPage,
  parseUserNotificationsPageQuery,
} from "@/app/dashboard/(user)/notifications/lib/get-user-notifications-page";
import { requireAuthSession } from "@/lib/auth/session";

type UserNotificationsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function UserNotificationsPage({
  searchParams,
}: UserNotificationsPageProps) {
  return (
    <DashboardPageShell>
      <Suspense fallback={<DashboardPageTitleFallback />}>
        <UserNotificationsPageIntro />
      </Suspense>

      <Suspense fallback={<DashboardTableCardFallback />}>
        <UserNotificationsPagePanel searchParams={searchParams} />
      </Suspense>
    </DashboardPageShell>
  );
}

async function UserNotificationsPageIntro() {
  return <h1 className="text-base font-semibold">اعلان‌ها</h1>;
}

async function UserNotificationsPagePanel({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await requireAuthSession();
  const userId = session.user.id;

  const resolvedSearchParams = await searchParams;
  const query = parseUserNotificationsPageQuery(resolvedSearchParams);
  const data = await getUserNotificationsPage(userId, query);

  return (
    <UserNotificationsPanel
      userId={userId}
      isOwnInbox
      canMarkRead
      notifications={data.notifications}
      page={data.page}
      pageSize={data.pageSize}
      totalCount={data.totalCount}
      filter={data.filter}
    />
  );
}
