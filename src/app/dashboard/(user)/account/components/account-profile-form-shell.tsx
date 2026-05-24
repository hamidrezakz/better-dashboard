"use client";

import { useId, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProfileAction } from "@/app/action/dashboard/users/account/update-profile-action";
import {
  ACCOUNT_PROFILE_FORM_INITIAL_STATE,
  type AccountProfileFormState,
} from "@/app/action/dashboard/users/account/shared/account-form-state";
import { AccountProfileFormFields } from "@/app/dashboard/(user)/account/components/account-profile-form-fields";
import { accountCopy } from "@/app/dashboard/(user)/account/lib/account-copy";
import { DashboardFormShell } from "@/app/dashboard/components/form-shell/dashboard-form-shell";
import { DashboardFormShellFooterActions } from "@/app/dashboard/components/form-shell/dashboard-form-shell-footer-actions";
import { toast } from "sonner";

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
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<AccountProfileFormState>(
    ACCOUNT_PROFILE_FORM_INITIAL_STATE,
  );

  const handleSubmit = () => {
    if (!formRef.current) {
      return;
    }

    const formData = new FormData(formRef.current);
    startTransition(async () => {
      const nextState = await updateProfileAction(
        ACCOUNT_PROFILE_FORM_INITIAL_STATE,
        formData,
      );
      setState(nextState);

      if (nextState.success) {
        toast.success("Your profile was updated.");
        onClose();
        router.refresh();
        return;
      }

      if (nextState.formError) {
        toast.error(nextState.formError);
      }
    });
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
            disabled: isPending,
          }}
          primary={{
            label: isPending ? "Saving…" : "Save changes",
            onClick: handleSubmit,
            disabled: isPending,
          }}
        />
      }
    >
      <form
        ref={formRef}
        id={formId}
        noValidate
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
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
