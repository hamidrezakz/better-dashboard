import Link from "next/link";
import { SettingsIcon } from "lucide-react";
import type { OrganizationBranding } from "@/app/dashboard/organizations/[organizationId]/manage/lib/organization-form-utils";
import { OrganizationAvatar } from "@/components/organization/organization-avatar";
import { RoleBadge } from "@/components/badge/role-badge";
import { Button } from "@/components/ui/button";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import type { MembershipRole } from "@/generated/prisma/enums";

type OrganizationProfileHeaderPanelProps = {
  organization: OrganizationBranding;
  viewerRole: MembershipRole | null;
  canManage: boolean;
};

export function OrganizationProfileHeaderPanel({
  organization,
  viewerRole,
  canManage,
}: OrganizationProfileHeaderPanelProps) {
  const labels = dashboardNavLabels.viewProfile;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <OrganizationAvatar
          name={organization.name}
          logo={organization.logo}
          size="lg"
          className="size-12"
        />
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-xl font-semibold tracking-tight text-balance sm:text-2xl">
              {organization.name}
            </h1>
            {viewerRole ? <RoleBadge role={viewerRole} /> : null}
          </div>
        </div>
      </div>

      {canManage ? (
        <Button
          size="sm"
          nativeButton={false}
          className="shrink-0"
          render={
            <Link href={dashboardRoutes.organizationMembers(organization.id)} />
          }
        >
          <SettingsIcon className="size-4" aria-hidden />
          {labels.manageOrganization}
        </Button>
      ) : null}
    </div>
  );
}
