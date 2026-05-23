"use client";

import { useState } from "react";
import {
  InvitationFormShell,
  type InvitationFormShellTarget,
} from "@/app/dashboard/organizations/[organizationId]/manage/invitations/components/invitation-form-shell";
import { InvitationViewDialog } from "@/app/dashboard/organizations/[organizationId]/manage/invitations/components/invitation-view-dialog";
import { InvitationsTable } from "@/app/dashboard/organizations/[organizationId]/manage/invitations/components/invitations-table";
import type { OrganizationInvitationItem } from "@/app/dashboard/organizations/[organizationId]/manage/invitations/lib/invitation-form-utils";

type InvitationFeedback = {
  kind: "success" | "error";
  message: string;
};

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

export function InvitationManagementPanel({
  organizationId,
  teams,
  invitations,
  page,
  pageSize,
  totalCount,
}: InvitationManagementPanelProps) {
  const [feedback, setFeedback] = useState<InvitationFeedback | null>(null);
  const [viewInvitation, setViewInvitation] =
    useState<OrganizationInvitationItem | null>(null);
  const [formTarget, setFormTarget] =
    useState<InvitationFormShellTarget | null>(null);

  return (
    <div className="space-y-4">
      <InvitationsTable
        organizationId={organizationId}
        invitations={invitations}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        feedback={feedback}
        onView={setViewInvitation}
        onEdit={(invitation) => setFormTarget({ mode: "edit", invitation })}
        onCreate={() => setFormTarget({ mode: "create" })}
        onFeedback={setFeedback}
      />

      <InvitationViewDialog
        invitation={viewInvitation}
        onClose={() => setViewInvitation(null)}
      />

      <InvitationFormShell
        organizationId={organizationId}
        target={formTarget}
        teams={teams}
        onClose={() => setFormTarget(null)}
        onFeedback={setFeedback}
      />
    </div>
  );
}
