"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createOrganizationNotificationAction } from "@/app/action/dashboard/organizations/manage/notifications/create-organization-notification-action";
import { DashboardFormShell } from "@/app/dashboard/components/form-shell/dashboard-form-shell";
import { DashboardFormShellFooterActions } from "@/app/dashboard/components/form-shell/dashboard-form-shell-footer-actions";
import {
  NotificationForm,
  useNotificationForm,
  type NotificationFormTarget,
} from "@/app/dashboard/organizations/[organizationId]/manage/notifications/components/notification-form";
import {
  audienceNeedsTeam,
  audienceNeedsUser,
} from "@/app/dashboard/organizations/[organizationId]/manage/notifications/lib/notification-form-utils";
import { toast } from "sonner";

export type NotificationFormShellProps = {
  organizationId: string;
  target: NotificationFormTarget | null;
  teams: Array<{ id: string; name: string }>;
  onClose: () => void;
};

export function NotificationFormShell({
  organizationId,
  target,
  teams,
  onClose,
}: NotificationFormShellProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { form, onChange, canSubmit } = useNotificationForm(target);

  const open = Boolean(target);

  const handleSubmit = () => {
    if (!form || !target) {
      return;
    }

    startTransition(async () => {
      const result = await createOrganizationNotificationAction({
        organizationId,
        title: form.title,
        body: form.body,
        audience: form.audience,
        userId: audienceNeedsUser(form.audience)
          ? form.selectedUser?.id
          : undefined,
        teamId: audienceNeedsTeam(form.audience) ? form.teamId : undefined,
      });

      if (!result.success) {
        toast.error(result.error ?? "Could not send the notification.");
        return;
      }

      toast.success("Notification sent.");
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
      title="New notification"
      description="Send a notification to organization members."
      footer={
        <DashboardFormShellFooterActions
          cancel={{
            label: "Cancel",
            onClick: onClose,
            disabled: isPending,
          }}
          primary={{
            label: isPending ? "Sending..." : "Send notification",
            onClick: handleSubmit,
            disabled: isPending || !canSubmit,
          }}
        />
      }
    >
      {form ? (
        <NotificationForm
          organizationId={organizationId}
          form={form}
          teams={teams}
          disabled={isPending}
          onChange={onChange}
        />
      ) : null}
    </DashboardFormShell>
  );
}
