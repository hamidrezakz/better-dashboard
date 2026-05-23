import { Suspense } from "react";
import { DashboardTableCardFallback } from "@/app/dashboard/components/dashboard-page-fallbacks";
import { NotificationManagementPanel } from "@/app/dashboard/organizations/[organizationId]/manage/notifications/components/notification-management-panel";
import {
  getOrganizationNotificationsPage,
  parseOrganizationNotificationsPageQuery,
} from "@/app/dashboard/organizations/[organizationId]/manage/notifications/lib/get-organization-notifications-page";

type OrganizationNotificationsPageProps = {
  params: Promise<{
    organizationId: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function OrganizationNotificationsPage(
  props: OrganizationNotificationsPageProps,
) {
  return (
    <Suspense fallback={<DashboardTableCardFallback />}>
      <OrganizationNotificationsPageContent {...props} />
    </Suspense>
  );
}

async function OrganizationNotificationsPageContent({
  params,
  searchParams,
}: OrganizationNotificationsPageProps) {
  const { organizationId } = await params;
  const resolvedSearchParams = await searchParams;
  const query = parseOrganizationNotificationsPageQuery(resolvedSearchParams);
  const data = await getOrganizationNotificationsPage(organizationId, query);

  return (
    <NotificationManagementPanel
      organizationId={organizationId}
      teams={data.teams}
      notifications={data.notifications}
      page={data.page}
      pageSize={data.pageSize}
      totalCount={data.totalCount}
    />
  );
}
