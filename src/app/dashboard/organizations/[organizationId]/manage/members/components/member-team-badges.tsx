"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { XIcon } from "lucide-react";
import { removeOrganizationTeamMemberAction } from "@/app/action/dashboard/organizations/manage/teams/remove-organization-team-member-action";
import type { OrganizationMemberTeamItem } from "@/app/dashboard/organizations/[organizationId]/manage/members/lib/get-organization-members-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type MemberTeamBadgesProps = {
  organizationId: string;
  userId: string;
  teams: OrganizationMemberTeamItem[];
  disabled?: boolean;
  onFeedback: (
    feedback: { kind: "success" | "error"; message: string } | null,
  ) => void;
};

export function MemberTeamBadges({
  organizationId,
  userId,
  teams,
  disabled,
  onFeedback,
}: MemberTeamBadgesProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (!teams.length) {
    return <span className="text-muted-foreground">—</span>;
  }

  const handleRemove = (team: OrganizationMemberTeamItem) => {
    startTransition(async () => {
      const result = await removeOrganizationTeamMemberAction({
        organizationId,
        teamId: team.id,
        userId,
      });

      if (!result.success) {
        onFeedback({
          kind: "error",
          message: result.error ?? "Could not remove the team membership.",
        });
        return;
      }

      onFeedback({
        kind: "success",
        message: `Removed from ${team.name}.`,
      });
      router.refresh();
    });
  };

  return (
    <ul className="flex flex-wrap gap-1.5">
      {teams.map((team) => (
        <li key={team.id}>
          <Badge variant="secondary" className="gap-0.5 pe-0.5">
            <span className="max-w-28 truncate" title={team.name}>
              {team.name}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="size-5"
              disabled={disabled || isPending}
              aria-label={`Remove from ${team.name}`}
              onClick={() => handleRemove(team)}
            >
              <XIcon className="size-3" />
            </Button>
          </Badge>
        </li>
      ))}
    </ul>
  );
}
