"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addOrganizationTeamMembersAction } from "@/app/action/dashboard/organizations/manage/teams/add-organization-team-members-action";
import { ResponsiveFormOverlay } from "@/components/responsive-form-overlay/responsive-form-overlay";
import { ResponsiveFormOverlayFooterActions } from "@/components/responsive-form-overlay/responsive-form-overlay-footer-actions";
import { OrganizationMembersMultiCombobox } from "@/app/dashboard/organizations/[organizationId]/manage/components/organization-members-multi-combobox";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import { formatDataTableNumber } from "@/lib/data-table/pagination";
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
      toast.error("حداقل یک عضو برای افزودن انتخاب کنید.");
      return;
    }

    startTransition(async () => {
      const result = await addOrganizationTeamMembersAction({
        organizationId,
        teamId,
        userIds: selectedUsers.map((user) => user.id),
      });

      if (!result.success) {
        toast.error(result.error ?? "افزودن اعضای تیم ممکن نشد.");
        return;
      }

      const addedCount = result.addedCount ?? selectedUsers.length;

      toast.success(
        addedCount === 1
          ? "۱ عضو به تیم افزوده شد."
          : `${formatDataTableNumber(addedCount)} عضو به تیم افزوده شد.`,
      );
      setSelectedUsers([]);
      onClose();
      router.refresh();
    });
  };

  return (
    <ResponsiveFormOverlay
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleClose();
        }
      }}
      title={dashboardNavLabels.teamManage.addMembers}
      footer={
        <ResponsiveFormOverlayFooterActions
          cancel={{
            label: "انصراف",
            onClick: handleClose,
            disabled: isPending,
          }}
          primary={{
            label: "افزودن اعضا",
            onClick: handleSubmit,
            disabled: isPending || !selectedUsers.length,
          }}
        />
      }
    >
      <div className="space-y-2">
        <FormLabel required>اعضا</FormLabel>
        <OrganizationMembersMultiCombobox
          organizationId={organizationId}
          value={selectedUsers}
          onValueChange={setSelectedUsers}
          excludeUserIds={excludeUserIds}
          disabled={isPending}
        />
      </div>
    </ResponsiveFormOverlay>
  );
}
