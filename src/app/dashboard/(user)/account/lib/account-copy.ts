/** Account feature UI copy (not dashboard nav chrome). */
export const accountCopy = {
  hub: {
    title: "Account",
  },
  profile: {
    title: "Profile",
    description: "Update your display name and profile photo.",
  },
  security: {
    title: "Password",
    description: "Update the password you use to sign in.",
    unavailable:
      "This account does not sign in with email and password, so there is no password to change here.",
  },
  sessions: {
    title: "Active sessions",
    description: "Review devices signed in to your account.",
    empty: "No active sessions were found.",
    onlyThisDevice: "You are only signed in on this device.",
    currentDevice: "This device",
    revoke: "Revoke",
    revoking: "Revoking…",
    signOutOthers: "Sign out other sessions",
    signingOutOthers: "Signing out…",
    signedIn: "Signed in",
    expires: "Session ends",
    ip: "IP address",
  },
} as const;
