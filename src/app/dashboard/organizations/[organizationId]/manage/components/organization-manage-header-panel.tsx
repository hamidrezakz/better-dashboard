"use client";

import { useState } from "react";
import { PencilIcon } from "lucide-react";
import { OrganizationFormShell } from "@/app/dashboard/organizations/[organizationId]/manage/components/organization-form-shell";
import type { OrganizationBranding } from "@/app/dashboard/organizations/[organizationId]/manage/lib/organization-form-utils";
import { OrganizationAvatar } from "@/components/organization/organization-avatar";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import { Button } from "@/components/ui/button";

type OrganizationManageHeaderPanelProps = {
  organization: OrganizationBranding;
};

export function OrganizationManageHeaderPanel({
  organization,
}: OrganizationManageHeaderPanelProps) {
  const [editOpen, setEditOpen] = useState(false);
  const labels = dashboardNavLabels.organizationManage;

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <OrganizationAvatar
            name={organization.name}
            logo={organization.logo}
            size="lg"
          />
          <h1 className="truncate text-base font-semibold">
            {organization.name}
          </h1>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setEditOpen(true)}
        >
          <PencilIcon className="size-4" aria-hidden />
          {labels.editOrganization}
        </Button>
      </div>

      <OrganizationFormShell
        organization={organization}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </>
  );
}
