"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createOrganizationInvitationAction } from "@/app/action/dashboard/organizations/manage/invitations/create-organization-invitation-action";
import { updateOrganizationInvitationAction } from "@/app/action/dashboard/organizations/manage/invitations/update-organization-invitation-action";
import { ResponsiveFormOverlay } from "@/components/responsive-form-overlay/responsive-form-overlay";
import { ResponsiveFormOverlayFooterActions } from "@/components/responsive-form-overlay/responsive-form-overlay-footer-actions";
import {
  InvitationForm,
  useInvitationForm,
  type InvitationFormTarget,
} from "@/app/dashboard/organizations/[organizationId]/manage/invitations/components/invitation-form";
import {
  parsePositiveNumberInput,
  TEAM_NONE_VALUE,
} from "@/app/dashboard/organizations/[organizationId]/manage/invitations/lib/invitation-form-utils";
import { toast } from "sonner";

export type InvitationFormShellTarget = InvitationFormTarget;

export type InvitationFormShellProps = {
  organizationId: string;
  target: InvitationFormShellTarget | null;
  teams: Array<{ id: string; name: string }>;
  onClose: () => void;
};

export function InvitationFormShell({
  organizationId,
  target,
  teams,
  onClose,
}: InvitationFormShellProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { form, onChange, isEdit, canSubmit } = useInvitationForm(target);

  const open = Boolean(target);
  const title = isEdit ? "ویرایش دعوت‌نامه" : "ایجاد دعوت‌نامه";

  const handleSubmit = () => {
    if (!form || !target) {
      return;
    }

    const maxUses = parsePositiveNumberInput(form.maxUses);

    if (maxUses === -1) {
      toast.error("حداکثر استفاده باید عدد مثبت باشد.");
      return;
    }

    startTransition(async () => {
      const payload = {
        organizationId,
        joinScope: form.joinScope,
        teamId: form.teamId === TEAM_NONE_VALUE ? undefined : form.teamId,
        expiresAt: form.expiresAt,
        maxUses,
      };

      const result =
        target.mode === "edit"
          ? await updateOrganizationInvitationAction({
              ...payload,
              invitationId: target.invitation.id,
            })
          : await createOrganizationInvitationAction(payload);

      if (!result.success) {
        toast.error(
          result.error ??
            (target.mode === "edit"
              ? "به‌روزرسانی دعوت‌نامه ممکن نشد."
              : "ایجاد دعوت‌نامه ممکن نشد."),
        );
        return;
      }

      toast.success(
        target.mode === "edit" ? "دعوت‌نامه به‌روزرسانی شد." : "دعوت‌نامه ایجاد شد.",
      );
      onClose();
      router.refresh();
    });
  };

  const primaryLabel = isPending
    ? isEdit
      ? "در حال ذخیره…"
      : "در حال ایجاد…"
    : isEdit
      ? "ذخیره"
      : "ایجاد";

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
            label: primaryLabel,
            onClick: handleSubmit,
            disabled: isPending || !canSubmit,
          }}
        />
      }
    >
      {form ? (
        <InvitationForm
          form={form}
          teams={teams}
          disabled={isPending}
          onChange={onChange}
        />
      ) : null}
    </ResponsiveFormOverlay>
  );
}
