import {
  organizationManageSlices,
  type OrganizationManageSliceKey,
} from "@/app/dashboard/lib/dashboard-slices";

export type OrganizationManageTabKey = OrganizationManageSliceKey;

export const organizationManageNavItems = organizationManageSlices.map(
  (slice) => ({
    key: slice.key,
    label: slice.label,
    pathSuffix: slice.pathSuffix,
    href: slice.href,
  }),
);

export function getActiveOrganizationManageTab(
  pathname: string,
): OrganizationManageTabKey {
  const match = [...organizationManageNavItems]
    .reverse()
    .find(
      (item) => item.key !== "members" && pathname.includes(item.pathSuffix),
    );

  return match?.key ?? "members";
}
