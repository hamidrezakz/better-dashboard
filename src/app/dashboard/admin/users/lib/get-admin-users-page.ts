import { cacheLife, cacheTag } from "next/cache";
import {
  ADMIN_USERS_DEFAULT_PAGE_SIZE,
  parseAdminUserTableFilter,
  type AdminUserTableFilter,
} from "@/app/dashboard/admin/users/lib/admin-users-table-params";
import { dashboardCacheTags } from "@/app/dashboard/lib/cache-tags";
import type { UserRole } from "@/generated/prisma/enums";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  clampDataTablePage,
  parseDataTableFilter,
  parseDataTablePage,
  parseDataTablePageSize,
  parseDataTableQuery,
} from "@/lib/data-table/search-params";

const MIN_QUERY_LENGTH = 2;

export type AdminUserItem = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: UserRole;
  banned: boolean;
  createdAt: string;
};

export type AdminUsersPageQuery = {
  page: number;
  pageSize: number;
  filter: AdminUserTableFilter;
  q?: string;
};

export type AdminUsersPageResult = {
  users: AdminUserItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  filter: AdminUserTableFilter;
  q?: string;
};

function buildUsersWhere(
  filter: AdminUserTableFilter,
  q?: string,
): Prisma.UserWhereInput {
  const and: Prisma.UserWhereInput[] = [];

  if (filter === "admins") {
    and.push({ role: "admin" });
  } else if (filter === "users") {
    and.push({ role: "user" });
  } else if (filter === "banned") {
    and.push({ banned: true });
  }

  if (q && q.length >= MIN_QUERY_LENGTH) {
    and.push({
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ],
    });
  }

  return and.length ? { AND: and } : {};
}

export function parseAdminUsersPageQuery(
  searchParams: Record<string, string | string[] | undefined>,
): AdminUsersPageQuery {
  const q = parseDataTableQuery(searchParams);

  return {
    page: parseDataTablePage(searchParams),
    pageSize: parseDataTablePageSize(searchParams, {
      defaultPageSize: ADMIN_USERS_DEFAULT_PAGE_SIZE,
    }),
    filter: parseAdminUserTableFilter(parseDataTableFilter(searchParams)),
    q,
  };
}

async function loadAdminUsersPage(
  query: AdminUsersPageQuery,
): Promise<AdminUsersPageResult> {
  const where = buildUsersWhere(query.filter, query.q);

  const totalCount = await prisma.user.count({ where });
  const page = clampDataTablePage(query.page, totalCount, query.pageSize);
  const skip = (page - 1) * query.pageSize;

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      banned: true,
      createdAt: true,
    },
    orderBy: [{ createdAt: "desc" }],
    skip,
    take: query.pageSize,
  });

  return {
    users: users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      banned: user.banned,
      createdAt: user.createdAt.toISOString(),
    })),
    totalCount,
    page,
    pageSize: query.pageSize,
    filter: query.filter,
    q: query.q,
  };
}

export async function getAdminUsersPage(query: AdminUsersPageQuery) {
  "use cache";

  cacheLife("minutes");
  cacheTag(dashboardCacheTags.adminUsersPage());

  return loadAdminUsersPage(query);
}
