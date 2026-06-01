"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import type { AdminOrganizationItem } from "@/app/dashboard/admin/organizations/lib/get-admin-organizations-page";
import { adminOrganizationsTablePath } from "@/app/dashboard/admin/organizations/lib/admin-organizations-table-params";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import { DataTableSearchField } from "@/components/data-table/data-table-search-field";
import { DataTableShell } from "@/components/data-table/data-table-shell";
import { DataTableViewport } from "@/components/data-table/data-table-viewport";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format-date";

type AdminOrganizationsTableProps = {
  organizations: AdminOrganizationItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  q?: string;
};

function organizationInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AdminOrganizationsTable({
  organizations,
  page,
  pageSize,
  totalCount,
  q,
}: AdminOrganizationsTableProps) {
  const router = useRouter();

  const navigate = (input: {
    page?: number;
    pageSize?: number;
    q?: string;
  }) => {
    router.push(
      adminOrganizationsTablePath({
        page: input.page,
        pageSize: input.pageSize ?? pageSize,
        q: input.q !== undefined ? input.q : q,
      }),
    );
  };

  const buildSearchPath = useCallback(
    (input: { q?: string; page?: number }) =>
      adminOrganizationsTablePath({
        page: input.page ?? 1,
        pageSize,
        q: input.q,
      }),
    [pageSize],
  );

  const openManage = (organizationId: string) => {
    router.push(dashboardRoutes.organizationMembers(organizationId));
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>{dashboardNavLabels.adminTabs.organizations}</CardTitle>
        <CardAction className="w-full sm:w-auto">
          <DataTableSearchField
            query={q}
            placeholder="جستجو بر اساس نام یا شناسه…"
            buildPath={buildSearchPath}
          />
        </CardAction>
      </CardHeader>

      <CardContent>
        <DataTableShell
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={(nextPage) => navigate({ page: nextPage })}
          onPageSizeChange={(nextPageSize) =>
            navigate({ page: 1, pageSize: nextPageSize })
          }
          countLabel="سازمان"
        >
          <DataTableViewport>
            <Table className="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-0 whitespace-normal">
                    سازمان
                  </TableHead>
                  <TableHead className="hidden min-w-0 whitespace-normal sm:table-cell">
                    شناسه
                  </TableHead>
                  <TableHead className="whitespace-normal">اعضا</TableHead>
                  <TableHead className="hidden whitespace-normal sm:table-cell">
                    تیم‌ها
                  </TableHead>
                  <TableHead className="hidden whitespace-normal lg:table-cell">
                    ایجاد
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizations.length ? (
                  organizations.map((organization) => (
                    <TableRow
                      key={organization.id}
                      className="cursor-pointer"
                      onClick={() => openManage(organization.id)}
                    >
                      <TableCell className="min-w-0 whitespace-normal">
                        <div className="flex min-w-0 items-center gap-2">
                          <Avatar size="sm" className="shrink-0">
                            {organization.logo ? (
                              <AvatarImage src={organization.logo} alt="" />
                            ) : null}
                            <AvatarFallback>
                              {organizationInitials(organization.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span
                            className="block truncate font-medium"
                            title={organization.name}
                          >
                            {organization.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden min-w-0 whitespace-normal text-muted-foreground sm:table-cell">
                        <span
                          className="block truncate"
                          title={organization.slug}
                        >
                          {organization.slug}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-normal">
                        {organization.memberCount}
                      </TableCell>
                      <TableCell className="hidden whitespace-normal sm:table-cell">
                        {organization.teamCount}
                      </TableCell>
                      <TableCell className="hidden whitespace-normal lg:table-cell">
                        {formatDate(organization.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-6 text-center text-muted-foreground"
                    >
                      سازمانی یافت نشد.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DataTableViewport>
        </DataTableShell>
      </CardContent>
    </Card>
  );
}
