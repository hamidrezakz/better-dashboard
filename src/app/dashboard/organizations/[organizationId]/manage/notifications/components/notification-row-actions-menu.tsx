"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import { deleteOrganizationNotificationAction } from "@/app/action/dashboard/organizations/manage/notifications/delete-organization-notification-action";
import { toast } from "sonner";
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

type NotificationRowActionsMenuProps = {
  organizationId: string;
  notificationId: string;
  notificationTitle: string;
  onView: () => void;
};

export function NotificationRowActionsMenu({
  organizationId,
  notificationId,
  notificationTitle,
  onView,
}: NotificationRowActionsMenuProps) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteOrganizationNotificationAction({
        organizationId,
        notificationId,
      });

      if (!result.success) {
        toast.error(result.error ?? "حذف اعلان ممکن نشد.");
        return;
      }

      setConfirmOpen(false);
      toast.success("اعلان حذف شد.");
      router.refresh();
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button size="icon-sm" variant="ghost" />}
          aria-label="عملیات اعلان"
        >
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-36">
          <DropdownMenuItem onClick={onView}>
            <EyeIcon />
            مشاهده
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2Icon />
            حذف
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف اعلان</AlertDialogTitle>
            <AlertDialogDescription>
              «{notificationTitle}» برای همیشه حذف خواهد شد. این کار قابل بازگشت
              نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>انصراف</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isPending}
              onClick={handleDelete}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
