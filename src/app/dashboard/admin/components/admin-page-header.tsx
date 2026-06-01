import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";

export function AdminPageHeader() {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
        {dashboardNavLabels.adminPage.title}
      </h1>
      <p className="text-sm text-muted-foreground">
        {dashboardNavLabels.adminPage.description}
      </p>
    </div>
  );
}
