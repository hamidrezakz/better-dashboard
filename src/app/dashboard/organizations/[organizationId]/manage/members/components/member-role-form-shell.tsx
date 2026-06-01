"use client";

import { useEffect, useId, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrganizationMemberRoleAction } from "@/app/action/dashboard/organizations/manage/members/update-organization-member-role-action";
import { ResponsiveFormOverlay } from "@/components/responsive-form-overlay/responsive-form-overlay";
import { ResponsiveFormOverlayFooterActions } from "@/components/responsive-form-overlay/responsive-form-overlay-footer-actions";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import { toast } from "sonner";
import type { OrganizationMemberItem } from "@/app/dashboard/organizations/[organizationId]/manage/members/lib/get-organization-members-page";
import { MembershipRole } from "@/generated/prisma/enums";
import { FormLabel } from "@/components/form/form-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MemberRoleFormShellProps = {
  organizationId: string;
  member: OrganizationMemberItem | null;
  actorRole: MembershipRole | null;
  open: boolean;
  onClose: () => void;
};

function roleOptions(actorRole: MembershipRole | null): MembershipRole[] {
  if (actorRole === MembershipRole.owner) {
    return [MembershipRole.owner, MembershipRole.admin, MembershipRole.member];
  }

  if (actorRole === MembershipRole.admin) {
    return [MembershipRole.admin, MembershipRole.member];
  }

  return [MembershipRole.member];
}

export function MemberRoleFormShell({
  organizationId,
  member,
  actorRole,
  open,
  onClose,
}: MemberRoleFormShellProps) {
  const router = useRouter();
  const fieldId = useId();
  const [isPending, startTransition] = useTransition();
  const [role, setRole] = useState<MembershipRole>(MembershipRole.member);

  useEffect(() => {
    if (member) {
      setRole(member.role);
    }
  }, [member]);

  const options = roleOptions(actorRole);
  const canSubmit = Boolean(member && options.includes(role));

  const handleSubmit = () => {
    if (!member || !canSubmit) {
      return;
    }

    startTransition(async () => {
      const result = await updateOrganizationMemberRoleAction({
        organizationId,
        memberId: member.id,
        role,
      });

      if (!result.success) {
        toast.error(result.error ?? "Could not update the member role.");
        return;
      }

      toast.success("Member role updated.");
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
      title={dashboardNavLabels.memberManage.changeRole}
      footer={
        <ResponsiveFormOverlayFooterActions
          cancel={{
            label: "Cancel",
            onClick: onClose,
            disabled: isPending,
          }}
          primary={{
            label: "Save role",
            onClick: handleSubmit,
            disabled: isPending || !canSubmit,
          }}
        />
      }
    >
      {member ? (
        <div className="space-y-2">
          <FormLabel htmlFor={`${fieldId}-role`} required>
            Role
          </FormLabel>
          <Select
            value={role}
            onValueChange={(value) => setRole(value as MembershipRole)}
            disabled={isPending}
          >
            <SelectTrigger id={`${fieldId}-role`} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}
    </ResponsiveFormOverlay>
  );
}
