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
  const title = isEdit ? "Edit invitation" : "Create invitation";

  const handleSubmit = () => {
    if (!form || !target) {
      return;
    }

    const maxUses = parsePositiveNumberInput(form.maxUses);

    if (maxUses === -1) {
      toast.error("Maximum uses must be a positive number.");
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
              ? "Could not update the invitation."
              : "Could not create the invitation."),
        );
        return;
      }

      toast.success(
        target.mode === "edit" ? "Invitation updated." : "Invitation created.",
      );
      onClose();
      router.refresh();
    });
  };

  const primaryLabel = isPending
    ? isEdit
      ? "Saving..."
      : "Creating..."
    : isEdit
      ? "Save"
      : "Create";

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
            label: "Cancel",
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
