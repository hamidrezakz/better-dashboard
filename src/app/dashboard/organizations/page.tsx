import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { RoleBadge } from "@/components/globals-badge/role-badge";
import { DashboardOrganizationsCardFallback } from "@/app/dashboard/components/dashboard-page-fallbacks";
import { DashboardPageShell } from "@/app/dashboard/components/dashboard-page-shell";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import { isOrganizationManagerRole } from "@/app/dashboard/lib/dashboard-access";
import { requireAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export default function DashboardOrganizationsPage() {
  return (
    <DashboardPageShell>
      <Suspense fallback={<DashboardOrganizationsCardFallback />}>
        <DashboardOrganizationsContent />
      </Suspense>
    </DashboardPageShell>
  );
}

async function DashboardOrganizationsContent() {
  const session = await requireAuthSession();

  const memberships = await prisma.member.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>سازمان‌های من</CardTitle>
      </CardHeader>
      <CardContent>
        {memberships.length ? (
          <div className="divide-y">
            {memberships.map((membership) => (
              <div
                key={membership.id}
                className="flex flex-wrap items-center justify-between gap-2 py-2.5 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {membership.organization.name}
                  </span>
                  <RoleBadge role={membership.role} />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    render={
                      <Link
                        href={dashboardRoutes.organizationRoot(
                          membership.organization.id,
                        )}
                      />
                    }
                  >
                    مشاهده
                  </Button>
                  {isOrganizationManagerRole(membership.role) && (
                    <Button
                      size="sm"
                      variant="outline"
                      render={
                        <Link
                          href={dashboardRoutes.organizationMembers(
                            membership.organization.id,
                          )}
                        />
                      }
                    >
                      مدیریت
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty className="border">
            <EmptyHeader>
              <EmptyTitle>سازمانی پیدا نشد</EmptyTitle>
              <EmptyDescription>هنوز عضو هیچ سازمانی نیستید.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  );
}
