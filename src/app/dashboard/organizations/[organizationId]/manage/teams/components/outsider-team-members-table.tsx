import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { OrganizationOutsiderTeamMemberItem } from "@/app/dashboard/organizations/[organizationId]/manage/teams/lib/team-form-utils";

type OutsiderTeamMembersTableProps = {
  items: OrganizationOutsiderTeamMemberItem[];
};

export function OutsiderTeamMembersTable({
  items,
}: OutsiderTeamMembersTableProps) {
  if (!items.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>اعضای تیم بدون عضویت سازمان</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>نام</TableHead>
              <TableHead>ایمیل</TableHead>
              <TableHead>تیم</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <span
                    className="block max-w-48 truncate"
                    title={item.userName}
                  >
                    {item.userName}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <span
                    className="block max-w-md truncate"
                    title={item.userEmail}
                  >
                    {item.userEmail}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className="block max-w-40 truncate"
                    title={item.teamName}
                  >
                    {item.teamName}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
