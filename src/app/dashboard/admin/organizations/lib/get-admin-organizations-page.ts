import { cacheLife, cacheTag } from "next/cache";
import { ADMIN_ORGANIZATIONS_DEFAULT_PAGE_SIZE } from "@/app/dashboard/admin/organizations/lib/admin-organizations-table-params";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  clampDataTablePage,
  parseDataTablePage,
  parseDataTablePageSize,
  parseDataTableQuery,
} from "@/lib/data-table/search-params";

const MIN_QUERY_LENGTH = 2;

export type AdminOrganizationItem = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  memberCount: number;
  teamCount: number;
  createdAt: string;
};

export type AdminOrganizationsPageQuery = {
  page: number;
  pageSize: number;
  q?: string;
};

export type AdminOrganizationsPageResult = {
  organizations: AdminOrganizationItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  q?: string;
};

function buildOrganizationsWhere(q?: string): Prisma.OrganizationWhereInput {
  if (!q || q.length < MIN_QUERY_LENGTH) {
    return {};
  }

  return {
    OR: [
      { name: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
    ],
  };
}

export function parseAdminOrganizationsPageQuery(
  searchParams: Record<string, string | string[] | undefined>,
): AdminOrganizationsPageQuery {
  return {
    page: parseDataTablePage(searchParams),
    pageSize: parseDataTablePageSize(searchParams, {
      defaultPageSize: ADMIN_ORGANIZATIONS_DEFAULT_PAGE_SIZE,
    }),
    q: parseDataTableQuery(searchParams),
  };
}

async function loadAdminOrganizationsPage(
  query: AdminOrganizationsPageQuery,
): Promise<AdminOrganizationsPageResult> {
  const where = buildOrganizationsWhere(query.q);

  const totalCount = await prisma.organization.count({ where });
  const page = clampDataTablePage(query.page, totalCount, query.pageSize);
  const skip = (page - 1) * query.pageSize;

  const organizations = await prisma.organization.findMany({
    where,
    select: {
      id: true,
      name: true,
      slug: true,
      logo: true,
      createdAt: true,
      _count: {
        select: {
          members: true,
          teams: true,
        },
      },
    },
    orderBy: [{ createdAt: "desc" }],
    skip,
    take: query.pageSize,
  });

  return {
    organizations: organizations.map((organization) => ({
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      logo: organization.logo,
      memberCount: organization._count.members,
      teamCount: organization._count.teams,
      createdAt: organization.createdAt.toISOString(),
    })),
    totalCount,
    page,
    pageSize: query.pageSize,
    q: query.q,
  };
}

export async function getAdminOrganizationsPage(
  query: AdminOrganizationsPageQuery,
) {
  "use cache";

  cacheLife("minutes");
  cacheTag(dashboardCacheTags.adminOrganizationsPage());

  return loadAdminOrganizationsPage(query);
}
