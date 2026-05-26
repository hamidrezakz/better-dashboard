"use server";

import { updateTag } from "next/cache";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import { canManageOrganization } from "@/app/dashboard/lib/dashboard-access";
import { organizationInvitationByIdWhere } from "@/app/dashboard/organizations/[organizationId]/manage/invitations/lib/organization-invitation-access";
import { requireAuthSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

type DeleteOrganizationInvitationInput = {
  organizationId: string;
  invitationId: string;
};

type DeleteOrganizationInvitationResult = {
  success: boolean;
  error?: string;
};

export async function deleteOrganizationInvitationAction(
  input: DeleteOrganizationInvitationInput,
): Promise<DeleteOrganizationInvitationResult> {
  const session = await requireAuthSession();
  const actorUserId = session.user.id;

  const canManage = await canManageOrganization({
    viewerUserId: actorUserId,
    organizationId: input.organizationId,
  });

  if (!canManage) {
    return {
      success: false,
      error:
        "You don't have permission to manage invitations for this organization.",
    };
  }

  const invitation = await prisma.invitation.findFirst({
    where: organizationInvitationByIdWhere({
      organizationId: input.organizationId,
      invitationId: input.invitationId,
    }),
    select: { id: true },
  });

  if (!invitation) {
    return {
      success: false,
      error: "Invitation not found.",
    };
  }

  await prisma.invitation.delete({
    where: { id: invitation.id },
  });

  updateTag(
    dashboardCacheTags.organizationInvitationsById(input.organizationId),
  );

  return { success: true };
}
