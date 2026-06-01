"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import { removeOrganizationTeamMemberAction } from "@/app/action/dashboard/organizations/manage/teams/remove-organization-team-member-action";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import { toast } from "sonner";
import type { OrganizationTeamMemberItem } from "@/app/dashboard/organizations/[organizationId]/manage/teams/[teamId]/members/lib/get-organization-team-members-page";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TeamMemberRowActionsMenuProps = {
  organizationId: string;
  teamId: string;
  member: OrganizationTeamMemberItem;
};

export function TeamMemberRowActionsMenu({
  organizationId,
  teamId,
  member,
}: TeamMemberRowActionsMenuProps) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    startTransition(async () => {
      const result = await removeOrganizationTeamMemberAction({
        organizationId,
        teamId,
        userId: member.userId,
      });

      if (!result.success) {
        toast.error(result.error ?? "حذف عضو تیم ممکن نشد.");
        return;
      }

      setConfirmOpen(false);
      toast.success("عضو از تیم حذف شد.");
      router.refresh();
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button size="icon-sm" variant="ghost" />}
          aria-label={`عملیات ${member.name}`}
        >
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-44">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2Icon />
            {dashboardNavLabels.memberManage.removeFromTeam}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف از تیم</AlertDialogTitle>
            <AlertDialogDescription>
              {member.name} از این تیم حذف شود؟ همچنان عضو سازمان خواهد ماند.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>انصراف</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isPending}
              onClick={handleRemove}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
