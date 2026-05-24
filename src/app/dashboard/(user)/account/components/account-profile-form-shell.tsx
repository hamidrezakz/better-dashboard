"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfileAction } from "@/app/action/dashboard/users/account/update-profile-action";
import { ACCOUNT_PROFILE_FORM_INITIAL_STATE } from "@/app/action/dashboard/users/account/shared/account-form-state";
import { AccountProfileFormFields } from "@/app/dashboard/(user)/account/components/account-profile-form-fields";
import { accountCopy } from "@/app/dashboard/(user)/account/lib/account-copy";
import { DashboardFormShell } from "@/app/dashboard/components/form-shell/dashboard-form-shell";
import { DashboardFormShellFooterActions } from "@/app/dashboard/components/form-shell/dashboard-form-shell-footer-actions";
import { dashboardToast } from "@/app/dashboard/lib/dashboard-toast";

type AccountProfileFormShellProps = {
  profile: {
    name: string;
    email: string;
    image: string | null;
  };
  open: boolean;
  onClose: () => void;
};

export function AccountProfileFormShell({
  profile,
  open,
  onClose,
}: AccountProfileFormShellProps) {
  const router = useRouter();
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, formAction] = useActionState(
    updateProfileAction,
    ACCOUNT_PROFILE_FORM_INITIAL_STATE,
  );

  useEffect(() => {
    if (!open) {
      return;
    }
    if (state.success) {
      setIsSubmitting(false);
      dashboardToast.success("Your profile was updated.");
      onClose();
      router.refresh();
    } else if (state.formError) {
      setIsSubmitting(false);
      dashboardToast.error(state.formError);
    } else if (state.fieldErrors) {
      setIsSubmitting(false);
    }
  }, [state, open, onClose, router]);

  const handleSubmit = () => {
    setIsSubmitting(true);
    formRef.current?.requestSubmit();
  };

  return (
    <DashboardFormShell
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
      title={accountCopy.profile.title}
      description={accountCopy.profile.description}
      footer={
        <DashboardFormShellFooterActions
          cancel={{
            label: "Cancel",
            onClick: onClose,
            disabled: isSubmitting,
          }}
          primary={{
            label: isSubmitting ? "Saving…" : "Save changes",
            onClick: handleSubmit,
            disabled: isSubmitting,
          }}
        />
      }
    >
      <form
        key={open ? "open" : "closed"}
        ref={formRef}
        id={formId}
        action={formAction}
        noValidate
        className="contents"
      >
        <AccountProfileFormFields
          formId={formId}
          profile={profile}
          state={state}
        />
      </form>
    </DashboardFormShell>
  );
}
