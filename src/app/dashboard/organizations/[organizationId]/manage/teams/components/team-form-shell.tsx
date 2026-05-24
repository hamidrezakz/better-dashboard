"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createOrganizationTeamAction } from "@/app/action/dashboard/organizations/manage/teams/create-organization-team-action";
import { updateOrganizationTeamAction } from "@/app/action/dashboard/organizations/manage/teams/update-organization-team-action";
import { DashboardFormShell } from "@/app/dashboard/components/form-shell/dashboard-form-shell";
import {
  TeamForm,
  useTeamForm,
  type TeamFormTarget,
} from "@/app/dashboard/organizations/[organizationId]/manage/teams/components/team-form";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import { Button } from "@/components/ui/button";

export type TeamFormShellTarget = TeamFormTarget;

type TeamFormShellProps = {
  organizationId: string;
  target: TeamFormShellTarget | null;
  onClose: () => void;
  onFeedback: (
    feedback: { kind: "success" | "error"; message: string } | null,
  ) => void;
};

export function TeamFormShell({
  organizationId,
  target,
  onClose,
  onFeedback,
}: TeamFormShellProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { form, onChange, isEdit, canSubmit, nameError } = useTeamForm(target);

  const open = Boolean(target);
  const title = isEdit
    ? dashboardNavLabels.teamManage.editTeam
    : dashboardNavLabels.teamManage.addTeam;
  const description = isEdit
    ? "Update the team name."
    : "Create a team for this organization.";

  const handleSubmit = () => {
    if (!form || !target || !canSubmit) {
      return;
    }

    onFeedback(null);

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
        onFeedback({
          kind: "error",
          message: result.error ?? "Could not save the team.",
        });
        return;
      }

      onFeedback({
        kind: "success",
        message: isEdit ? "Team updated." : "Team created.",
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
      title={title}
      description={description}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isPending || !canSubmit}
            onClick={handleSubmit}
          >
            {isEdit ? "Save changes" : "Create team"}
          </Button>
        </>
      }
    >
      {form && target ? (
        <div className="space-y-4">
          <TeamForm
            target={target}
            form={form}
            onChange={onChange}
            disabled={isPending}
          />
          {nameError ? (
            <p className="text-sm text-destructive">{nameError}</p>
          ) : null}
        </div>
      ) : null}
    </DashboardFormShell>
  );
}
