import { Building2Icon } from "lucide-react";
import type { InvitationJoinPreview } from "@/app/join/lib/get-invitation-join-preview";
import { JoinInvitationPanel } from "@/app/join/[invitationId]/components/join-invitation-panel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

type JoinInvitationCardProps = {
  invitationId: string;
  preview: Extract<InvitationJoinPreview, { kind: "ok" }>;
  isAuthenticated: boolean;
  autoAccept: boolean;
};

function getOrganizationInitial(name: string) {
  return name.trim().charAt(0) || "؟";
}

export function JoinInvitationCard({
  invitationId,
  preview,
  isAuthenticated,
  autoAccept,
}: JoinInvitationCardProps) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardContent className="space-y-5 pt-6">
        <div className="flex justify-center">
          <Avatar size="lg">
            {preview.organization?.logo ? (
              <AvatarImage
                alt=""
                src={preview.organization.logo}
              />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-primary">
              {preview.organization ? (
                getOrganizationInitial(preview.organization.name)
              ) : (
                <Building2Icon className="size-5" aria-hidden="true" />
              )}
            </AvatarFallback>
          </Avatar>
        </div>

        <JoinInvitationPanel
          invitationId={invitationId}
          preview={preview}
          isAuthenticated={isAuthenticated}
          autoAccept={autoAccept}
        />
      </CardContent>
    </Card>
  );
}
