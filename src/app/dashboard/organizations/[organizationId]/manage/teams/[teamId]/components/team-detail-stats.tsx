import {
  CalendarIcon,
  PercentIcon,
  UsersIcon,
  UsersRoundIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/format-date";

type TeamDetailStatsProps = {
  memberCount: number;
  organizationMemberCount: number;
  createdAt: string;
  updatedAt: string;
};

export function TeamDetailStats({
  memberCount,
  organizationMemberCount,
  createdAt,
  updatedAt,
}: TeamDetailStatsProps) {
  const coveragePercent =
    organizationMemberCount > 0
      ? Math.round((memberCount / organizationMemberCount) * 100)
      : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <UsersRoundIcon className="size-4" />
            Team members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{memberCount}</p>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <UsersIcon className="size-4" />
            Organization members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{organizationMemberCount}</p>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <PercentIcon className="size-4" />
            Org coverage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{coveragePercent}%</p>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <CalendarIcon className="size-4" />
            Created
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-2xl font-semibold">{formatDate(createdAt)}</p>
          <p className="text-xs text-muted-foreground">
            Updated {formatDate(updatedAt)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
