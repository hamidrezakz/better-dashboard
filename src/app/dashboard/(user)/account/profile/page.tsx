import { Suspense } from "react";
import { notFound } from "next/navigation";
import { LoadingFallback } from "@/components/loading-fallback";
import { AccountProfileForm } from "@/app/dashboard/(user)/account/profile/components/account-profile-form";
import { getAccountProfile } from "@/app/dashboard/(user)/account/lib/get-account-profile";
import { requireAuthSession } from "@/lib/auth-session";

export default function AccountProfilePage() {
  return (
    <Suspense fallback={<LoadingFallback className="min-h-[20vh]" />}>
      <AccountProfilePageContent />
    </Suspense>
  );
}

async function AccountProfilePageContent() {
  const session = await requireAuthSession();
  const profile = await getAccountProfile(session.user.id);

  if (!profile) {
    notFound();
  }

  return <AccountProfileForm profile={profile} />;
}
