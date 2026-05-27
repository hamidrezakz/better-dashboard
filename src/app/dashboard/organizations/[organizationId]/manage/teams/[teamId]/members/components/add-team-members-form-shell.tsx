"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addOrganizationTeamMembersAction } from "@/app/action/dashboard/organizations/manage/teams/add-organization-team-members-action";
import { FormShell } from "@/components/form-shell/form-shell";
import { FormShellFooterActions } from "@/components/form-shell/form-shell-footer-actions";
import { OrganizationMembersMultiCombobox } from "@/app/dashboard/organizations/[organizationId]/manage/components/organization-members-multi-combobox";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import { toast } from "sonner";
import type { UserSearchOption } from "@/app/action/dashboard/users/search-users-action";
import { FormLabel } from "@/components/form/form-label";

type AddTeamMembersFormShellProps = {
  organizationId: string;
  teamId: string;
  open: boolean;
  excludeUserIds: string[];
  onClose: () => void;
};

export function AddTeamMembersFormShell({
  organizationId,
  teamId,
  open,
  excludeUserIds,
  onClose,
}: AddTeamMembersFormShellProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedUsers, setSelectedUsers] = useState<UserSearchOption[]>([]);

  const handleClose = () => {
    setSelectedUsers([]);
    onClose();
  };

  const handleSubmit = () => {
    if (!selectedUsers.length) {
      toast.error("Select at least one member to add.");
      return;
    }

    startTransition(async () => {
      const result = await addOrganizationTeamMembersAction({
        organizationId,
        teamId,
        userIds: selectedUsers.map((user) => user.id),
      });

      if (!result.success) {
        toast.error(result.error ?? "Could not add team members.");
        return;
      }

      const addedCount = result.addedCount ?? selectedUsers.length;

      toast.success(
        addedCount === 1
          ? "1 member added to the team."
          : `${addedCount} members added to the team.`,
      );
      setSelectedUsers([]);
      onClose();
      router.refresh();
    });
  };

  return (
    <FormShell
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleClose();
        }
      }}
      title={dashboardNavLabels.teamManage.addMembers}
      footer={
        <FormShellFooterActions
          cancel={{
            label: "Cancel",
            onClick: handleClose,
            disabled: isPending,
          }}
          primary={{
            label: "Add members",
            onClick: handleSubmit,
            disabled: isPending || !selectedUsers.length,
          }}
        />
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
    </FormShell>
  );
}
