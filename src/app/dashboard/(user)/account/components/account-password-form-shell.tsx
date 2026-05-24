"use client";

import { useId, useRef, useState, useTransition } from "react";
import { changePasswordAction } from "@/app/action/dashboard/users/account/change-password-action";
import {
  ACCOUNT_PASSWORD_FORM_INITIAL_STATE,
  type AccountPasswordFormState,
} from "@/app/action/dashboard/users/account/shared/account-form-state";
import { AccountPasswordFormFields } from "@/app/dashboard/(user)/account/components/account-password-form-fields";
import { accountCopy } from "@/app/dashboard/(user)/account/lib/account-copy";
import { DashboardFormShell } from "@/app/dashboard/components/form-shell/dashboard-form-shell";
import { DashboardFormShellFooterActions } from "@/app/dashboard/components/form-shell/dashboard-form-shell-footer-actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type AccountPasswordFormShellProps = {
  hasPasswordCredential: boolean;
  open: boolean;
  onClose: () => void;
};

export function AccountPasswordFormShell({
  hasPasswordCredential,
  open,
  onClose,
}: AccountPasswordFormShellProps) {
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<AccountPasswordFormState>(
    ACCOUNT_PASSWORD_FORM_INITIAL_STATE,
  );

  const handleSubmit = () => {
    if (!formRef.current) {
      return;
    }

    const formData = new FormData(formRef.current);
    startTransition(async () => {
      const nextState = await changePasswordAction(
        ACCOUNT_PASSWORD_FORM_INITIAL_STATE,
        formData,
      );
      setState(nextState);

      if (nextState.success) {
        toast.success("Your password was updated.");
        formRef.current?.reset();
        onClose();
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
      title={accountCopy.security.title}
      description={
        hasPasswordCredential
          ? accountCopy.security.description
          : accountCopy.security.unavailable
      }
      footer={
        hasPasswordCredential ? (
          <DashboardFormShellFooterActions
            cancel={{
              label: "Cancel",
              onClick: onClose,
              disabled: isPending,
            }}
            primary={{
              label: isPending ? "Updating…" : "Update password",
              onClick: handleSubmit,
              disabled: isPending,
            }}
          />
        ) : (
          <div className="flex w-full justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        )
      }
    >
      {hasPasswordCredential ? (
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
          <AccountPasswordFormFields formId={formId} state={state} />
        </form>
      ) : null}
    </DashboardFormShell>
  );
}
