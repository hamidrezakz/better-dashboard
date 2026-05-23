import { notFound } from "next/navigation";
import { AccountProfileForm } from "@/app/dashboard/(user)/account/profile/components/account-profile-form";
import { getAccountProfile } from "@/app/dashboard/(user)/account/lib/get-account-profile";
import { requireAuthSession } from "@/lib/auth-session";

export default async function AccountProfilePage() {
  const session = await requireAuthSession();
  const profile = await getAccountProfile(session.user.id);

  if (!profile) {
    notFound();
  }

  return <AccountProfileForm profile={profile} />;
}
