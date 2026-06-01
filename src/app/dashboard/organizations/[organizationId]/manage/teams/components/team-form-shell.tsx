"use client";

import { useId, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createOrganizationTeamAction } from "@/app/action/dashboard/organizations/manage/teams/create-organization-team-action";
import { updateOrganizationTeamAction } from "@/app/action/dashboard/organizations/manage/teams/update-organization-team-action";
import { ResponsiveFormOverlay } from "@/components/responsive-form-overlay/responsive-form-overlay";
import { ResponsiveFormOverlayFooterActions } from "@/components/responsive-form-overlay/responsive-form-overlay-footer-actions";
import {
  TeamForm,
  useTeamForm,
  type TeamFormTarget,
} from "@/app/dashboard/organizations/[organizationId]/manage/teams/components/team-form";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import { toast } from "sonner";

export type TeamFormShellTarget = TeamFormTarget;

type TeamFormShellProps = {
  organizationId: string;
  target: TeamFormShellTarget | null;
  onClose: () => void;
};

export function TeamFormShell({
  organizationId,
  target,
  onClose,
}: TeamFormShellProps) {
  const router = useRouter();
  const nameErrorId = useId();
  const [isPending, startTransition] = useTransition();
  const {
    form,
    onChange,
    markNameTouched,
    attemptSubmit,
    isEdit,
    canSubmit,
    displayNameError,
  } = useTeamForm(target);

  const open = Boolean(target);
  const title = isEdit
    ? dashboardNavLabels.teamManage.editTeam
    : dashboardNavLabels.teamManage.addTeam;

  const handleSubmit = () => {
    if (!form || !target || !attemptSubmit()) {
      return;
    }

    startTransition(async () => {
      const result =
        target.mode === "edit"
          ? await updateOrganizationTeamAction({
              organizationId,
              teamId: target.team.id,
              name: form.name,
            })
          : await createOrganizationTeamAction({
              organizationId,
              name: form.name,
            });

      if (!result.success) {
        toast.error(result.error ?? "ذخیره تیم ممکن نشد.");
        return;
      }

      toast.success(isEdit ? "تیم به‌روزرسانی شد." : "تیم ایجاد شد.");
      onClose();
      router.refresh();
    });
  };

  return (
    <ResponsiveFormOverlay
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
      title={title}
      footer={
        <ResponsiveFormOverlayFooterActions
          cancel={{
            label: "انصراف",
            onClick: onClose,
            disabled: isPending,
          }}
          primary={{
            label: isEdit ? "ذخیره تغییرات" : "ایجاد تیم",
            onClick: handleSubmit,
            disabled: isPending || !canSubmit,
          }}
        />
      }
    >
      {form && target ? (
        <TeamForm
          target={target}
          form={form}
          onChange={onChange}
          onNameBlur={markNameTouched}
          disabled={isPending}
          nameError={displayNameError}
          nameErrorId={nameErrorId}
        />
      ) : null}
    </ResponsiveFormOverlay>
  );
}
