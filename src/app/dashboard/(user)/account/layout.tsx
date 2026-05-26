import { DashboardPageShell } from "@/app/dashboard/components/dashboard-page-shell/dashboard-page-shell";
import { accountCopy } from "@/app/dashboard/(user)/account/lib/account-copy";

type AccountLayoutProps = {
  children: React.ReactNode;
};

export default function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <DashboardPageShell>
      <h1 className="w-full max-w-xl text-sm font-medium">
        {accountCopy.hub.title}
      </h1>
      {children}
    </DashboardPageShell>
  );
}
