"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createOrganizationNotificationAction } from "@/app/action/dashboard/organizations/manage/notifications/create-organization-notification-action";
import { DashboardFormShell } from "@/app/dashboard/components/form-shell/dashboard-form-shell";
import {
  NotificationForm,
  useNotificationForm,
  type NotificationFormTarget,
} from "@/app/dashboard/organizations/[organizationId]/manage/notifications/components/notification-form";
import {
  audienceNeedsTeam,
  audienceNeedsUser,
} from "@/app/dashboard/organizations/[organizationId]/manage/notifications/lib/notification-form-utils";
import { Button } from "@/components/ui/button";

export type NotificationFormShellProps = {
  organizationId: string;
  target: NotificationFormTarget | null;
  teams: Array<{ id: string; name: string }>;
  onClose: () => void;
  onFeedback: (
    feedback: { kind: "success" | "error"; message: string } | null,
  ) => void;
};

export function NotificationFormShell({
  organizationId,
  target,
  teams,
  onClose,
  onFeedback,
}: NotificationFormShellProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { form, onChange, canSubmit } = useNotificationForm(target);

  const open = Boolean(target);

  const handleSubmit = () => {
    if (!form || !target) {
      return;
    }

    onFeedback(null);

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
        onFeedback({
          kind: "error",
          message: result.error ?? "Could not send the notification.",
        });
        return;
      }

      onFeedback({
        kind: "success",
        message: "Notification sent.",
      });
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
        <>
          <Button disabled={isPending || !canSubmit} onClick={handleSubmit}>
            {isPending ? "Sending..." : "Send notification"}
          </Button>
          <Button variant="destructive" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
        </>
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
