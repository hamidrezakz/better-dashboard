"use server";

import { canManageOrganization } from "@/app/dashboard/lib/dashboard-access";
import {
  normalizeOrganizationLogo,
  normalizeOrganizationName,
  validateOrganizationLogo,
  validateOrganizationName,
} from "@/app/dashboard/organizations/[organizationId]/manage/lib/organization-form-utils";
import {
  invalidateOrganizationManageCache,
  invalidateOrganizationSidebarCaches,
} from "@/app/action/dashboard/organizations/manage/shared/invalidate-organization-manage-cache";
import { requireAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

type UpdateOrganizationInput = {
  organizationId: string;
  name: string;
  logo: string;
};

type UpdateOrganizationResult = {
  success: boolean;
  error?: string;
};

export async function updateOrganizationAction(
  input: UpdateOrganizationInput,
): Promise<UpdateOrganizationResult> {
  const session = await requireAuthSession();
  const actorUserId = session.user.id;

  const canManage = await canManageOrganization({
    viewerUserId: actorUserId,
    organizationId: input.organizationId,
  });

  if (!canManage) {
    return {
      success: false,
      error: "You don't have permission to update this organization.",
    };
  }

  const nameError = validateOrganizationName(input.name);
  const logoError = validateOrganizationLogo(input.logo);

  if (nameError) {
    return { success: false, error: nameError };
  }

  if (logoError) {
    return { success: false, error: logoError };
  }

  const name = normalizeOrganizationName(input.name);
  const logo = normalizeOrganizationLogo(input.logo);

  const updated = await prisma.organization.updateMany({
    where: { id: input.organizationId },
    data: {
      name,
      logo: logo.length > 0 ? logo : null,
    },
  });

  if (updated.count === 0) {
    return { success: false, error: "Organization not found." };
  }

  invalidateOrganizationManageCache(input.organizationId);
  invalidateOrganizationSidebarCaches(input.organizationId);

  return { success: true };
}
