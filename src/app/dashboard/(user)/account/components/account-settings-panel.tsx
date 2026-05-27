"use client";

import { useId, useRef, useState, useTransition, type RefObject } from "react";
import { useRouter } from "next/navigation";
import { changePasswordAction } from "@/app/action/dashboard/users/account/change-password-action";
import { revokeOtherSessionsAction } from "@/app/action/dashboard/users/account/revoke-other-sessions-action";
import { updateProfileAction } from "@/app/action/dashboard/users/account/update-profile-action";
import {
  ACCOUNT_PASSWORD_FORM_INITIAL_STATE,
  ACCOUNT_PROFILE_FORM_INITIAL_STATE,
  type AccountPasswordFormState,
  type AccountProfileFormState,
} from "@/app/action/dashboard/users/account/shared/account-form-state";
import { AccountPasswordFormFields } from "@/app/dashboard/(user)/account/components/account-password-form-fields";
import { AccountProfileFormFields } from "@/app/dashboard/(user)/account/components/account-profile-form-fields";
import type { AccountSessionDisplay } from "@/app/dashboard/(user)/account/components/account-sessions-content";
import { AccountSessionsContent } from "@/app/dashboard/(user)/account/components/account-sessions-content";
import { accountCopy } from "@/app/dashboard/(user)/account/lib/account-copy";
import type { AccountPanel } from "@/app/dashboard/(user)/account/lib/account-panel";
import { FormShell } from "@/components/form-shell/form-shell";
import { FormShellFooterActions } from "@/components/form-shell/form-shell-footer-actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type AccountSettingsPanelProps = {
  section: AccountPanel | null;
  onClose: () => void;
  profile: {
    name: string;
    email: string;
    image: string | null;
  };
  hasPasswordCredential: boolean;
  sessions: AccountSessionDisplay[];
  currentSessionToken: string;
};

export function AccountSettingsPanel({
  section,
  onClose,
  profile,
  hasPasswordCredential,
  sessions,
  currentSessionToken,
}: AccountSettingsPanelProps) {
  const router = useRouter();
  const profileFormId = useId();
  const passwordFormId = useId();
  const profileFormRef = useRef<HTMLFormElement>(null);
  const passwordFormRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [profileState, setProfileState] = useState<AccountProfileFormState>(
    ACCOUNT_PROFILE_FORM_INITIAL_STATE,
  );
  const [passwordState, setPasswordState] = useState<AccountPasswordFormState>(
    ACCOUNT_PASSWORD_FORM_INITIAL_STATE,
  );

  const open = section !== null;
  const hasOtherSessions = sessions.some(
    (session) => session.token !== currentSessionToken,
  );

  const handleProfileSubmit = () => {
    if (!profileFormRef.current) {
      return;
    }

    const formData = new FormData(profileFormRef.current);
    startTransition(async () => {
      const nextState = await updateProfileAction(
        ACCOUNT_PROFILE_FORM_INITIAL_STATE,
        formData,
      );
      setProfileState(nextState);

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

  const handlePasswordSubmit = () => {
    if (!passwordFormRef.current) {
      return;
    }

    const formData = new FormData(passwordFormRef.current);
    startTransition(async () => {
      const nextState = await changePasswordAction(
        ACCOUNT_PASSWORD_FORM_INITIAL_STATE,
        formData,
      );
      setPasswordState(nextState);

      if (nextState.success) {
        toast.success("Your password was updated.");
        passwordFormRef.current?.reset();
        onClose();
        router.refresh();
        return;
      }

      if (nextState.formError) {
        toast.error(nextState.formError);
      }
    });
  };

  const handleRevokeOthers = () => {
    startTransition(async () => {
      const result = await revokeOtherSessionsAction();
      if (!result.success) {
        toast.error(result.error ?? "Could not revoke other sessions.");
        return;
      }
      toast.success("Other sessions were signed out.");
      router.refresh();
    });
  };

  const { title, footer, children } = resolvePanelContent({
    section,
    isPending,
    hasPasswordCredential,
    hasOtherSessions,
    onClose,
    profileFormId,
    passwordFormId,
    profileFormRef,
    passwordFormRef,
    profile,
    profileState,
    passwordState,
    sessions,
    currentSessionToken,
    handleProfileSubmit,
    handlePasswordSubmit,
    handleRevokeOthers,
  });

  return (
    <FormShell
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
      title={title}
      footer={footer}
    >
      {children}
    </FormShell>
  );
}

type ResolvePanelContentArgs = {
  section: AccountPanel | null;
  isPending: boolean;
  hasPasswordCredential: boolean;
  hasOtherSessions: boolean;
  onClose: () => void;
  profileFormId: string;
  passwordFormId: string;
  profileFormRef: RefObject<HTMLFormElement | null>;
  passwordFormRef: RefObject<HTMLFormElement | null>;
  profile: AccountSettingsPanelProps["profile"];
  profileState: AccountProfileFormState;
  passwordState: AccountPasswordFormState;
  sessions: AccountSessionDisplay[];
  currentSessionToken: string;
  handleProfileSubmit: () => void;
  handlePasswordSubmit: () => void;
  handleRevokeOthers: () => void;
};

function resolvePanelContent({
  section,
  isPending,
  hasPasswordCredential,
  hasOtherSessions,
  onClose,
  profileFormId,
  passwordFormId,
  profileFormRef,
  passwordFormRef,
  profile,
  profileState,
  passwordState,
  sessions,
  currentSessionToken,
  handleProfileSubmit,
  handlePasswordSubmit,
  handleRevokeOthers,
}: ResolvePanelContentArgs) {
  switch (section) {
    case "profile":
      return {
        title: accountCopy.profile.title,
        footer: (
          <FormShellFooterActions
            cancel={{
              label: "Cancel",
              onClick: onClose,
              disabled: isPending,
            }}
            primary={{
              label: isPending ? "Saving…" : "Save changes",
              onClick: handleProfileSubmit,
              disabled: isPending,
            }}
          />
        ),
        children: (
          <form
            ref={profileFormRef}
            id={profileFormId}
            noValidate
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              handleProfileSubmit();
            }}
          >
            <AccountProfileFormFields
              formId={profileFormId}
              profile={profile}
              state={profileState}
            />
          </form>
        ),
      };
    case "security":
      return {
        title: accountCopy.security.title,
        footer: hasPasswordCredential ? (
          <FormShellFooterActions
            cancel={{
              label: "Cancel",
              onClick: onClose,
              disabled: isPending,
            }}
            primary={{
              label: isPending ? "Updating…" : "Update password",
              onClick: handlePasswordSubmit,
              disabled: isPending,
            }}
          />
        ) : (
          <div className="flex w-full justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        ),
        children: hasPasswordCredential ? (
          <form
            ref={passwordFormRef}
            id={passwordFormId}
            noValidate
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              handlePasswordSubmit();
            }}
          >
            <AccountPasswordFormFields
              formId={passwordFormId}
              state={passwordState}
            />
          </form>
        ) : (
          <p className="text-sm text-muted-foreground">
            {accountCopy.security.unavailable}
          </p>
        ),
      };
    case "sessions":
      return {
        title: accountCopy.sessions.title,
        footer: hasOtherSessions ? (
          <FormShellFooterActions
            cancel={{
              label: "Close",
              onClick: onClose,
              disabled: isPending,
            }}
            primary={{
              label: isPending
                ? accountCopy.sessions.signingOutOthers
                : accountCopy.sessions.signOutOthers,
              onClick: handleRevokeOthers,
              disabled: isPending,
            }}
          />
        ) : (
          <div className="flex w-full justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        ),
        children: (
          <AccountSessionsContent
            sessions={sessions}
            currentSessionToken={currentSessionToken}
            disabled={isPending}
          />
        ),
      };
    default:
      return {
        title: "",
        footer: null,
        children: null,
      };
  }
}
