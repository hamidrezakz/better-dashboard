import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountChangePasswordForm } from "@/app/dashboard/(user)/account/security/components/account-change-password-form";

type AccountSecurityPanelProps = {
  hasPasswordCredential: boolean;
};

export function AccountSecurityPanel({
  hasPasswordCredential,
}: AccountSecurityPanelProps) {
  if (!hasPasswordCredential) {
    return (
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Password</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your account does not use email and password sign-in, so you cannot
            change a password here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Password</CardTitle>
      </CardHeader>
      <CardContent>
        <AccountChangePasswordForm />
      </CardContent>
    </Card>
  );
}
