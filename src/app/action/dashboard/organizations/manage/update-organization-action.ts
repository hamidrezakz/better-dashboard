"use server";

import { headers } from "next/headers";
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
import { getOrganizationManageActionErrorMessage } from "@/app/action/dashboard/organizations/manage/shared/organization-manage-action-error";
import { auth } from "@/lib/auth/auth";
import { requireAuthSession } from "@/lib/auth/session";

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
      error: "مجوز به‌روزرسانی این سازمان را ندارید.",
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

  try {
    await auth.api.updateOrganization({
      headers: await headers(),
      body: {
        organizationId: input.organizationId,
        data: {
          name,
          logo: logo.length > 0 ? logo : "",
        },
      },
    });
  } catch (error) {
    return {
      success: false,
      error: getOrganizationManageActionErrorMessage(
        error,
        "به‌روزرسانی سازمان ممکن نشد.",
      ),
    };
  }

  invalidateOrganizationManageCache(input.organizationId);
  invalidateOrganizationSidebarCaches(input.organizationId);

  return { success: true };
}
