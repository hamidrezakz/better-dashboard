"use client";

import { useId, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrganizationAction } from "@/app/action/dashboard/organizations/manage/update-organization-action";
import { DashboardFormShell } from "@/app/dashboard/components/form-shell/dashboard-form-shell";
import { DashboardFormShellFooterActions } from "@/app/dashboard/components/form-shell/dashboard-form-shell-footer-actions";
import {
  OrganizationForm,
  useOrganizationForm,
} from "@/app/dashboard/organizations/[organizationId]/manage/components/organization-form";
import type { OrganizationBranding } from "@/app/dashboard/organizations/[organizationId]/manage/lib/organization-form-utils";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import { toast } from "sonner";

type OrganizationFormShellProps = {
  organization: OrganizationBranding | null;
  open: boolean;
  onClose: () => void;
};

export function OrganizationFormShell({
  organization,
  open,
  onClose,
}: OrganizationFormShellProps) {
  const router = useRouter();
  const nameErrorId = useId();
  const logoErrorId = useId();
  const [isPending, startTransition] = useTransition();
  const labels = dashboardNavLabels.organizationManage;
  const {
    form,
    onChange,
    markNameTouched,
    markLogoTouched,
    attemptSubmit,
    canSubmit,
    displayNameError,
    displayLogoError,
  } = useOrganizationForm(open ? organization : null);

  const handleSubmit = () => {
    if (!form || !organization || !attemptSubmit()) {
      return;
    }

    startTransition(async () => {
      const result = await updateOrganizationAction({
        organizationId: organization.id,
        name: form.name,
        logo: form.logo,
      });

      if (!result.success) {
        toast.error(result.error ?? "Could not update the organization.");
        return;
      }

      toast.success("Organization updated.");
      onClose();
      router.refresh();
    });
  };

  return (
    <DashboardFormShell
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
      title={labels.editOrganization}
      footer={
        <DashboardFormShellFooterActions
          cancel={{
            label: "Cancel",
            onClick: onClose,
            disabled: isPending,
          }}
          primary={{
            label: labels.saveOrganization,
            onClick: handleSubmit,
            disabled: isPending || !canSubmit,
          }}
        />
      }
    >
      {form && organization ? (
        <OrganizationForm
          organization={organization}
          form={form}
          onChange={onChange}
          onNameBlur={markNameTouched}
          onLogoBlur={markLogoTouched}
          disabled={isPending}
          nameError={displayNameError}
          logoError={displayLogoError}
          nameErrorId={nameErrorId}
          logoErrorId={logoErrorId}
        />
      ) : null}
    </DashboardFormShell>
  );
}
