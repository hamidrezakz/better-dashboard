import { AccountChangePasswordForm } from "@/app/dashboard/(user)/account/security/components/account-change-password-form";
import { accountCopy } from "@/app/dashboard/(user)/account/lib/account-copy";
import {
  AccountSectionCard,
  AccountSectionCardBody,
} from "@/app/dashboard/(user)/account/components/account-section-card";

type AccountSecurityPanelProps = {
  hasPasswordCredential: boolean;
};

export function AccountSecurityPanel({
  hasPasswordCredential,
}: AccountSecurityPanelProps) {
  if (!hasPasswordCredential) {
    return (
      <AccountSectionCard title={accountCopy.security.title}>
        <AccountSectionCardBody>
          <p className="text-sm text-muted-foreground">
            {accountCopy.security.unavailable}
          </p>
        </AccountSectionCardBody>
      </AccountSectionCard>
    );
  }

  return <AccountChangePasswordForm />;
}
