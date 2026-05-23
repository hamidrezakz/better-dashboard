"use client";

import type { ReactNode } from "react";
import { InvitationFormShellDialog } from "@/app/dashboard/organizations/[organizationId]/manage/invitations/components/invitation-form-shell-dialog";
import { InvitationFormShellDrawer } from "@/app/dashboard/organizations/[organizationId]/manage/invitations/components/invitation-form-shell-drawer";
import { useIsMobile } from "@/hooks/use-mobile";

export type InvitationFormShellSurfaceProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  isEdit: boolean;
  isPending: boolean;
  canSubmit: boolean;
  onClose: () => void;
  onSubmit: () => void;
  children: ReactNode;
};

export function InvitationFormShellSurface(props: InvitationFormShellSurfaceProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <InvitationFormShellDrawer {...props} />;
  }

  return <InvitationFormShellDialog {...props} />;
}
