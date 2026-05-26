import { cacheLife, cacheTag } from "next/cache";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import { organizationInvitationsWhere } from "@/app/dashboard/organizations/[organizationId]/manage/invitations/lib/organization-invitation-access";
import {
  INVITATIONS_DEFAULT_PAGE_SIZE,
  type OrganizationInvitationItem,
} from "@/app/dashboard/organizations/[organizationId]/manage/invitations/lib/invitation-form-utils";
import { prisma } from "@/lib/prisma";
import {
  clampDataTablePage,
  parseDataTablePage,
  parseDataTablePageSize,
} from "@/lib/data-table/search-params";

export type OrganizationInvitationsPageQuery = {
  page: number;
  pageSize: number;
};

export function parseOrganizationInvitationsPageQuery(
  searchParams: Record<string, string | string[] | undefined>,
): OrganizationInvitationsPageQuery {
  return {
    page: parseDataTablePage(searchParams),
    pageSize: parseDataTablePageSize(searchParams, {
      defaultPageSize: INVITATIONS_DEFAULT_PAGE_SIZE,
    }),
  };
}

export type OrganizationInvitationsPageResult = {
  teams: Array<{ id: string; name: string }>;
  invitations: OrganizationInvitationItem[];
  totalCount: number;
  page: number;
  pageSize: number;
};

export async function getOrganizationInvitationsPage(
  organizationId: string,
  query: OrganizationInvitationsPageQuery,
) {
  "use cache";

  cacheLife("minutes");
  cacheTag(dashboardCacheTags.organizationInvitationsById(organizationId));

  const invitationWhere = organizationInvitationsWhere(organizationId);

  const [teams, totalCount] = await Promise.all([
    prisma.team.findMany({
      where: { organizationId },
      select: { id: true, name: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.invitation.count({ where: invitationWhere }),
  ]);

  const page = clampDataTablePage(query.page, totalCount, query.pageSize);
  const skip = (page - 1) * query.pageSize;

  const invitations = await prisma.invitation.findMany({
    where: invitationWhere,
    include: {
      team: { select: { name: true } },
      inviter: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: query.pageSize,
  });

  return {
    teams,
    invitations: invitations.map((invitation) => ({
      id: invitation.id,
      organizationId: invitation.organizationId,
      teamId: invitation.teamId,
      teamName: invitation.team?.name ?? null,
      maxUses: invitation.maxUses,
      usedCount: invitation.usedCount,
      expiresAt: invitation.expiresAt.toISOString(),
      createdAt: invitation.createdAt.toISOString(),
      inviterName: invitation.inviter.name,
    })),
    totalCount,
    page,
    pageSize: query.pageSize,
  } satisfies OrganizationInvitationsPageResult;
}
