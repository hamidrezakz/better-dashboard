"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import { deleteOrganizationNotificationAction } from "@/app/action/dashboard/organizations/manage/notifications/delete-organization-notification-action";
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
  onDeleted?: (message: string) => void;
  onError?: (message: string) => void;
};

export function NotificationRowActionsMenu({
  organizationId,
  notificationId,
  notificationTitle,
  onView,
  onDeleted,
  onError,
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
        onError?.(result.error ?? "حذف اعلان ناموفق بود.");
        return;
      }

      setConfirmOpen(false);
      onDeleted?.("اعلان حذف شد.");
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
              اعلان «{notificationTitle}» برای همیشه حذف می‌شود. این کار قابل
              بازگشت نیست.
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
