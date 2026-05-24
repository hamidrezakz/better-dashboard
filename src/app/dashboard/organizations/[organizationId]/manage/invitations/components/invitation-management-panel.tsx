"use client";

import { useState } from "react";
import {
  InvitationFormShell,
  type InvitationFormShellTarget,
} from "@/app/dashboard/organizations/[organizationId]/manage/invitations/components/invitation-form-shell";
import { InvitationViewDialog } from "@/app/dashboard/organizations/[organizationId]/manage/invitations/components/invitation-view-dialog";
import { InvitationsTable } from "@/app/dashboard/organizations/[organizationId]/manage/invitations/components/invitations-table";
import type { OrganizationInvitationItem } from "@/app/dashboard/organizations/[organizationId]/manage/invitations/lib/invitation-form-utils";

type InvitationPanelTarget =
  | { kind: "view"; invitation: OrganizationInvitationItem }
  | InvitationFormShellTarget
  | null;

type InvitationManagementPanelProps = {
  organizationId: string;
  teams: Array<{
    id: string;
    name: string;
  }>;
  invitations: OrganizationInvitationItem[];
  page: number;
  pageSize: number;
  totalCount: number;
};

function isViewTarget(
  target: InvitationPanelTarget,
): target is { kind: "view"; invitation: OrganizationInvitationItem } {
  return target !== null && "kind" in target && target.kind === "view";
}

function toFormTarget(
  target: InvitationPanelTarget,
): InvitationFormShellTarget | null {
  if (!target || isViewTarget(target)) {
    return null;
  }
  return target;
}

export function InvitationManagementPanel({
  organizationId,
  teams,
  invitations,
  page,
  pageSize,
  totalCount,
}: InvitationManagementPanelProps) {
  const [panelTarget, setPanelTarget] = useState<InvitationPanelTarget>(null);

  const viewInvitation = isViewTarget(panelTarget)
    ? panelTarget.invitation
    : null;
  const formTarget = toFormTarget(panelTarget);

  return (
    <div className="space-y-4">
      <InvitationsTable
        organizationId={organizationId}
        invitations={invitations}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onView={(invitation) => setPanelTarget({ kind: "view", invitation })}
        onEdit={(invitation) => setPanelTarget({ mode: "edit", invitation })}
        onCreate={() => setPanelTarget({ mode: "create" })}
      />

      <InvitationViewDialog
        invitation={viewInvitation}
        onClose={() => setPanelTarget(null)}
      />

      <InvitationFormShell
        organizationId={organizationId}
        target={formTarget}
        teams={teams}
        onClose={() => setPanelTarget(null)}
      />
    </div>
  );
}
