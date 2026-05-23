import { AccountSecurityPanel } from "@/app/dashboard/(user)/account/security/components/account-security-panel";
import { getUserHasPasswordCredential } from "@/app/dashboard/(user)/account/lib/get-user-has-password-credential";
import { requireAuthSession } from "@/lib/auth-session";

export default async function AccountSecurityPage() {
  const session = await requireAuthSession();
  const hasPasswordCredential = await getUserHasPasswordCredential(
    session.user.id,
  );

  return <AccountSecurityPanel hasPasswordCredential={hasPasswordCredential} />;
}
