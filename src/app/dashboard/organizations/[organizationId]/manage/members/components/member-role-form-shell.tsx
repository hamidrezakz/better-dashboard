"use client";

import { useEffect, useId, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrganizationMemberRoleAction } from "@/app/action/dashboard/organizations/manage/members/update-organization-member-role-action";
import { DashboardFormShell } from "@/app/dashboard/components/form-shell/dashboard-form-shell";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import type { OrganizationMemberItem } from "@/app/dashboard/organizations/[organizationId]/manage/members/lib/get-organization-members-page";
import type { MembershipRole } from "@/generated/prisma/enums";
import { FormLabel } from "@/components/form/form-label";
import { Button } from "@/components/ui/button";
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
  onFeedback: (
    feedback: { kind: "success" | "error"; message: string } | null,
  ) => void;
};

function roleOptions(actorRole: MembershipRole | null): MembershipRole[] {
  if (actorRole === "OWNER") {
    return ["OWNER", "ADMIN", "MEMBER"];
  }

  if (actorRole === "ADMIN") {
    return ["ADMIN", "MEMBER"];
  }

  return ["MEMBER"];
}

export function MemberRoleFormShell({
  organizationId,
  member,
  actorRole,
  open,
  onClose,
  onFeedback,
}: MemberRoleFormShellProps) {
  const router = useRouter();
  const fieldId = useId();
  const [isPending, startTransition] = useTransition();
  const [role, setRole] = useState<MembershipRole>("MEMBER");

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

    onFeedback(null);

    startTransition(async () => {
      const result = await updateOrganizationMemberRoleAction({
        organizationId,
        memberId: member.id,
        role,
      });

      if (!result.success) {
        onFeedback({
          kind: "error",
          message: result.error ?? "Could not update the member role.",
        });
        return;
      }

      onFeedback({
        kind: "success",
        message: "Member role updated.",
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
      title={dashboardNavLabels.memberManage.changeRole}
      description={
        member
          ? `Update the organization role for ${member.name}.`
          : "Update member role."
      }
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
            Save role
          </Button>
        </>
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
    </DashboardFormShell>
  );
}
