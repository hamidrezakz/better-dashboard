import {
  assertDashboardUserExists,
  requireUserProfileAccess,
} from "@/app/dashboard/lib/dashboard-access";

type UserSegmentLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    userId: string;
  }>;
};

export default async function UserSegmentLayout({
  children,
  params,
}: UserSegmentLayoutProps) {
  const { userId } = await params;
  await requireUserProfileAccess(userId);
  await assertDashboardUserExists(userId);
  return children;
}
