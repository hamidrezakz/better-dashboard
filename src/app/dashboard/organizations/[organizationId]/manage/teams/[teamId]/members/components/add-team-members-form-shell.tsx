"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addOrganizationTeamMembersAction } from "@/app/action/dashboard/organizations/manage/teams/add-organization-team-members-action";
import { DashboardFormShell } from "@/app/dashboard/components/form-shell/dashboard-form-shell";
import { OrganizationMembersMultiCombobox } from "@/app/dashboard/organizations/[organizationId]/manage/components/organization-members-multi-combobox";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import type { UserSearchOption } from "@/app/action/dashboard/users/search-users-action";
import { FormLabel } from "@/components/form/form-label";
import { Button } from "@/components/ui/button";

type AddTeamMembersFormShellProps = {
  organizationId: string;
  teamId: string;
  open: boolean;
  excludeUserIds: string[];
  onClose: () => void;
  onFeedback: (
    feedback: { kind: "success" | "error"; message: string } | null,
  ) => void;
};

export function AddTeamMembersFormShell({
  organizationId,
  teamId,
  open,
  excludeUserIds,
  onClose,
  onFeedback,
}: AddTeamMembersFormShellProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedUsers, setSelectedUsers] = useState<UserSearchOption[]>([]);

  const handleSubmit = () => {
    if (!selectedUsers.length) {
      onFeedback({
        kind: "error",
        message: "Select at least one member to add.",
      });
      return;
    }

    onFeedback(null);

    startTransition(async () => {
      const result = await addOrganizationTeamMembersAction({
        organizationId,
        teamId,
        userIds: selectedUsers.map((user) => user.id),
      });

      if (!result.success) {
        onFeedback({
          kind: "error",
          message: result.error ?? "Could not add team members.",
        });
        return;
      }

      const addedCount = result.addedCount ?? selectedUsers.length;

      onFeedback({
        kind: "success",
        message:
          addedCount === 1
            ? "1 member added to the team."
            : `${addedCount} members added to the team.`,
      });
      setSelectedUsers([]);
      onClose();
      router.refresh();
    });
  };

  return (
    <DashboardFormShell
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setSelectedUsers([]);
          onClose();
        }
      }}
      title={dashboardNavLabels.teamManage.addMembers}
      description="Search and select organization members to add to this team."
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => {
              setSelectedUsers([]);
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isPending || !selectedUsers.length}
            onClick={handleSubmit}
          >
            Add members
          </Button>
        </>
      }
    >
      <div className="space-y-2">
        <FormLabel required>Members</FormLabel>
        <OrganizationMembersMultiCombobox
          organizationId={organizationId}
          value={selectedUsers}
          onValueChange={setSelectedUsers}
          excludeUserIds={excludeUserIds}
          disabled={isPending}
        />
      </div>
    </DashboardFormShell>
  );
}
