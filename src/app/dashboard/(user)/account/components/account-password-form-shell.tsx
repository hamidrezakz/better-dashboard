"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { changePasswordAction } from "@/app/action/dashboard/users/account/change-password-action";
import { ACCOUNT_PASSWORD_FORM_INITIAL_STATE } from "@/app/action/dashboard/users/account/shared/account-form-state";
import { AccountPasswordFormFields } from "@/app/dashboard/(user)/account/components/account-password-form-fields";
import { accountCopy } from "@/app/dashboard/(user)/account/lib/account-copy";
import { DashboardFormShell } from "@/app/dashboard/components/form-shell/dashboard-form-shell";
import { DashboardFormShellFooterActions } from "@/app/dashboard/components/form-shell/dashboard-form-shell-footer-actions";
import { dashboardToast } from "@/app/dashboard/lib/dashboard-toast";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, formAction] = useActionState(
    changePasswordAction,
    ACCOUNT_PASSWORD_FORM_INITIAL_STATE,
  );

  useEffect(() => {
    if (!open) {
      return;
    }
    if (state.success) {
      setIsSubmitting(false);
      dashboardToast.success("Your password was updated.");
      formRef.current?.reset();
      onClose();
    } else if (state.formError) {
      setIsSubmitting(false);
      dashboardToast.error(state.formError);
    } else if (state.fieldErrors) {
      setIsSubmitting(false);
    }
  }, [state, open, onClose]);

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
              disabled: isSubmitting,
            }}
            primary={{
              label: isSubmitting ? "Updating…" : "Update password",
              onClick: handleSubmit,
              disabled: isSubmitting,
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
          key={open ? "open" : "closed"}
          ref={formRef}
          id={formId}
          action={formAction}
          noValidate
          className="contents"
        >
          <AccountPasswordFormFields formId={formId} state={state} />
        </form>
      ) : null}
    </DashboardFormShell>
  );
}
