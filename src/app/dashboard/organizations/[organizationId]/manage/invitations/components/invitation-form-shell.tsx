"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createOrganizationInvitationAction } from "@/app/action/dashboard/organizations/manage/invitations/create-organization-invitation-action";
import { updateOrganizationInvitationAction } from "@/app/action/dashboard/organizations/manage/invitations/update-organization-invitation-action";
import {
  InvitationForm,
  useInvitationForm,
  type InvitationFormTarget,
} from "@/app/dashboard/organizations/[organizationId]/manage/invitations/components/invitation-form";
import { InvitationFormShellSurface } from "@/app/dashboard/organizations/[organizationId]/manage/invitations/components/invitation-form-shell-surface";
import {
  parsePositiveNumberInput,
  TEAM_NONE_VALUE,
} from "@/app/dashboard/organizations/[organizationId]/manage/invitations/lib/invitation-form-utils";

export type InvitationFormShellTarget = InvitationFormTarget;

export type InvitationFormShellProps = {
  organizationId: string;
  target: InvitationFormShellTarget | null;
  teams: Array<{ id: string; name: string }>;
  onClose: () => void;
  onFeedback: (
    feedback: { kind: "success" | "error"; message: string } | null,
  ) => void;
};

export function InvitationFormShell({
  organizationId,
  target,
  teams,
  onClose,
  onFeedback,
}: InvitationFormShellProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { form, onChange, isEdit, canSubmit } = useInvitationForm(target);

  const open = Boolean(target);
  const title = isEdit ? "Edit invitation" : "Create invitation";
  const description = isEdit
    ? "Update invitation details."
    : "Share a link for members to join the organization.";

  const handleSubmit = () => {
    if (!form || !target) {
      return;
    }

    const maxUses = parsePositiveNumberInput(form.maxUses);

    if (maxUses === -1) {
      onFeedback({
        kind: "error",
        message: "Maximum uses must be a positive number.",
      });
      return;
    }

    onFeedback(null);

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
        onFeedback({
          kind: "error",
          message:
            result.error ??
            (target.mode === "edit"
              ? "Could not update the invitation."
              : "Could not create the invitation."),
        });
        return;
      }

      onFeedback({
        kind: "success",
        message:
          target.mode === "edit"
            ? "Invitation updated."
            : "Invitation created.",
      });
      onClose();
      router.refresh();
    });
  };

  return (
    <InvitationFormShellSurface
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
      title={title}
      description={description}
      isEdit={isEdit}
      isPending={isPending}
      canSubmit={canSubmit}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      {form ? (
        <InvitationForm
          form={form}
          teams={teams}
          disabled={isPending}
          onChange={onChange}
        />
      ) : null}
    </InvitationFormShellSurface>
  );
}
