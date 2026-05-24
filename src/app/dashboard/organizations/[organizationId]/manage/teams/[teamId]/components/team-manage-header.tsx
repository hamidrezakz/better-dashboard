import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import { Button } from "@/components/ui/button";

type TeamManageHeaderProps = {
  organizationId: string;
  teamName: string;
  actions?: React.ReactNode;
};

export function TeamManageHeader({
  organizationId,
  teamName,
  actions,
}: TeamManageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={
            <Link href={dashboardRoutes.organizationTeams(organizationId)}>
              <ArrowLeftIcon />
              {dashboardNavLabels.teamManage.allTeams}
            </Link>
          }
        />
        <h2 className="text-lg font-semibold">
          <span className="block max-w-xl truncate" title={teamName}>
            {teamName}
          </span>
        </h2>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
