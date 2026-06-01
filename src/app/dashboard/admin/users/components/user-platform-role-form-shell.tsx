"use client";

import { useEffect, useId, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateUserPlatformRoleAction } from "@/app/action/dashboard/admin/users/update-user-platform-role-action";
import type { AdminUserItem } from "@/app/dashboard/admin/users/lib/get-admin-users-page";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import { ResponsiveFormOverlay } from "@/components/responsive-form-overlay/responsive-form-overlay";
import { ResponsiveFormOverlayFooterActions } from "@/components/responsive-form-overlay/responsive-form-overlay-footer-actions";
import { FormLabel } from "@/components/form/form-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/generated/prisma/enums";
import { badgeLabels } from "@/lib/badge/badge-labels";
import { toast } from "sonner";

type UserPlatformRoleFormShellProps = {
  user: AdminUserItem | null;
  open: boolean;
  onClose: () => void;
};

const PLATFORM_ROLE_OPTIONS: UserRole[] = [UserRole.user, UserRole.admin];

export function UserPlatformRoleFormShell({
  user,
  open,
  onClose,
}: UserPlatformRoleFormShellProps) {
  const router = useRouter();
  const fieldId = useId();
  const [isPending, startTransition] = useTransition();
  const [role, setRole] = useState<UserRole>(UserRole.user);

  useEffect(() => {
    if (user) {
      setRole(user.role);
    }
  }, [user]);

  const handleSubmit = () => {
    if (!user) {
      return;
    }

    startTransition(async () => {
      const result = await updateUserPlatformRoleAction({
        userId: user.id,
        role,
      });

      if (!result.success) {
        toast.error(result.error ?? "Could not update the platform role.");
        return;
      }

      toast.success("Platform role updated.");
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
      title={dashboardNavLabels.adminUserManage.changeRole}
      description={user ? `${user.name} · ${user.email}` : undefined}
      footer={
        <ResponsiveFormOverlayFooterActions
          cancel={{
            label: "Cancel",
            onClick: onClose,
            disabled: isPending,
          }}
          primary={{
            label: dashboardNavLabels.adminUserManage.changeRole,
            onClick: handleSubmit,
            disabled: isPending || !user,
          }}
        />
      }
    >
      {user ? (
        <div className="space-y-2">
          <FormLabel htmlFor={`${fieldId}-role`} required>
            Platform role
          </FormLabel>
          <Select
            value={role}
            onValueChange={(value) => setRole(value as UserRole)}
            disabled={isPending}
          >
            <SelectTrigger id={`${fieldId}-role`} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PLATFORM_ROLE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {badgeLabels.platformRole[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}
    </ResponsiveFormOverlay>
  );
}
