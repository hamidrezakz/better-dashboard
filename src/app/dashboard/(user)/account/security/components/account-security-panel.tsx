import { AccountChangePasswordForm } from "@/app/dashboard/(user)/account/security/components/account-change-password-form";
import { dashboardNavLabels } from "@/app/dashboard/lib/dashboard-nav-labels";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AccountSecurityPanelProps = {
  hasPasswordCredential: boolean;
};

const copy = dashboardNavLabels.accountPage;

export function AccountSecurityPanel({
  hasPasswordCredential,
}: AccountSecurityPanelProps) {
  if (!hasPasswordCredential) {
    return (
      <Card className="gap-0">
        <CardHeader className="border-b">
          <CardTitle>{copy.securityTitle}</CardTitle>
          <CardDescription>{copy.securityDescription}</CardDescription>
        </CardHeader>
        <CardContent className="py-5">
          <p className="text-sm text-muted-foreground">
            {copy.securityUnavailable}
          </p>
        </CardContent>
      </Card>
    );
  }

  return <AccountChangePasswordForm />;
}
