import {
  adminSlices,
  type AdminSliceKey,
} from "@/app/dashboard/admin/lib/admin-slices";

export type AdminTabKey = AdminSliceKey;

export const adminNavItems = adminSlices.map((slice) => ({
  key: slice.key,
  label: slice.label,
  pathSuffix: slice.pathSuffix,
  href: slice.href,
}));

export function getActiveAdminTab(pathname: string): AdminTabKey {
  const match = [...adminNavItems]
    .reverse()
    .find((item) => item.key !== "users" && pathname.includes(item.pathSuffix));

  return match?.key ?? "users";
}
