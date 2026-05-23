"use client";

import { resolveInvitationJoinScope } from "@/app/join/lib/invitation-scope";
import {
  getInvitationContactLabel,
  type OrganizationInvitationItem,
} from "@/app/dashboard/organizations/[organizationId]/manage/invitations/lib/invitation-form-utils";
import {
  formatPersianDate,
  persianDateTimeOptions,
} from "@/lib/format-persian-date";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
    <Dialog
      open={Boolean(invitation)}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="shrink-0 space-y-1 px-4 pt-4 pb-2">
          <DialogTitle>جزئیات دعوت‌نامه</DialogTitle>
        </DialogHeader>

        {invitation ? (
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
            <div className="space-y-4">
              <DetailMetadataList className="text-xs">
                <DetailMetadataRow label="نوع">
                  <span>{getInvitationContactLabel()}</span>
                </DetailMetadataRow>
                <DetailMetadataRow label="مقصد">
                  <div className="flex flex-col items-end gap-1">
                    <InvitationJoinScopeBadge scope={joinScope} />
                    {invitation.teamName ? (
                      <span className="text-[0.6875rem] text-muted-foreground">
                        {invitation.teamName}
                      </span>
                    ) : null}
                  </div>
                </DetailMetadataRow>
                <DetailMetadataRow label="وضعیت">
                  <InvitationDisplayStatusBadge invitation={invitation} />
                </DetailMetadataRow>
                <DetailMetadataRow label="انقضا">
                  <span className="text-muted-foreground tabular-nums">
                    {formatPersianDate(
                      invitation.expiresAt,
                      persianDateTimeOptions,
                    )}
                  </span>
                </DetailMetadataRow>
                <DetailMetadataRow label="ایجاد">
                  <span className="text-muted-foreground tabular-nums">
                    {formatPersianDate(
                      invitation.createdAt,
                      persianDateTimeOptions,
                    )}
                  </span>
                </DetailMetadataRow>
                <DetailMetadataRow label="استفاده">
                  <span>
                    {formatInvitationUsageLabel(
                      invitation.usedCount,
                      invitation.maxUses,
                    )}
                  </span>
                </DetailMetadataRow>
                <DetailMetadataRow label="ایجادکننده">
                  <span>{invitation.inviterName}</span>
                </DetailMetadataRow>
              </DetailMetadataList>

              <CopyableUrlField
                label="لینک عضویت"
                url={joinRoutes.invitationAbsolute(invitation.id)}
              />
            </div>
          </div>
        ) : null}

        <DialogFooter className="shrink-0 px-4 pb-4">
          <Button variant="outline" className="w-full" onClick={onClose}>
            بستن
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
