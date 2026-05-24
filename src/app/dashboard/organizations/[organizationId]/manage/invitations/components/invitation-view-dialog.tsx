"use client";

import { resolveInvitationJoinScope } from "@/app/join/lib/invitation-scope";
import {
  getInvitationContactLabel,
  type OrganizationInvitationItem,
} from "@/app/dashboard/organizations/[organizationId]/manage/invitations/lib/invitation-form-utils";
import { DashboardFormShell } from "@/app/dashboard/components/form-shell/dashboard-form-shell";
import { dateTimeOptions, formatDate } from "@/lib/format-date";
import { formatInvitationUsageLabel } from "@/lib/invitation-display-status";
import { joinRoutes } from "@/app/join/lib/join-routes";
import { CopyableUrlField } from "@/components/copyable-url-field";
import { InvitationDisplayStatusBadge } from "@/components/globals-badge/invitation-display-status-badge";
import { InvitationJoinScopeBadge } from "@/components/globals-badge/invitation-join-scope-badge";
import {
  DetailMetadataList,
  DetailMetadataRow,
} from "@/components/detail-metadata-list";
import { Button } from "@/components/ui/button";

type InvitationViewDialogProps = {
  invitation: OrganizationInvitationItem | null;
  onClose: () => void;
};

export function InvitationViewDialog({
  invitation,
  onClose,
}: InvitationViewDialogProps) {
  const joinScope = invitation
    ? resolveInvitationJoinScope({
        organizationId: invitation.organizationId,
        teamId: invitation.teamId,
      })
    : "unknown";

  return (
    <DashboardFormShell
      open={Boolean(invitation)}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
      title="Invitation details"
      description=" "
      footer={
        <div className="flex w-full justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      {invitation ? (
        <div className="space-y-4">
          <DetailMetadataList className="text-xs">
            <DetailMetadataRow label="Type">
              <span>{getInvitationContactLabel()}</span>
            </DetailMetadataRow>
            <DetailMetadataRow label="Destination">
              <div className="flex flex-col items-end gap-1">
                <InvitationJoinScopeBadge scope={joinScope} />
                {invitation.teamName ? (
                  <span className="text-[0.6875rem] text-muted-foreground">
                    {invitation.teamName}
                  </span>
                ) : null}
              </div>
            </DetailMetadataRow>
            <DetailMetadataRow label="Status">
              <InvitationDisplayStatusBadge invitation={invitation} />
            </DetailMetadataRow>
            <DetailMetadataRow label="Expires">
              <span className="text-muted-foreground tabular-nums">
                {formatDate(invitation.expiresAt, dateTimeOptions)}
              </span>
            </DetailMetadataRow>
            <DetailMetadataRow label="Created">
              <span className="text-muted-foreground tabular-nums">
                {formatDate(invitation.createdAt, dateTimeOptions)}
              </span>
            </DetailMetadataRow>
            <DetailMetadataRow label="Usage">
              <span>
                {formatInvitationUsageLabel(
                  invitation.usedCount,
                  invitation.maxUses,
                )}
              </span>
            </DetailMetadataRow>
            <DetailMetadataRow label="Created by">
              <span>{invitation.inviterName}</span>
            </DetailMetadataRow>
          </DetailMetadataList>

          <CopyableUrlField
            label="Join link"
            url={joinRoutes.invitationAbsolute(invitation.id)}
          />
        </div>
      ) : null}
    </DashboardFormShell>
  );
}
