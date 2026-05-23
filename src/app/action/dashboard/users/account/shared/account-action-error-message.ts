function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message.toLowerCase();
  }

  if (typeof error === "string") {
    return error.toLowerCase();
  }

  return "";
}

export function getAccountActionErrorMessage({
  error,
  fallback,
}: {
  error: unknown;
  fallback: string;
}) {
  const message = getErrorMessage(error);

  if (!message) {
    return fallback;
  }

  if (
    message.includes("too many") ||
    message.includes("rate limit") ||
    message.includes("429")
  ) {
    return "Too many attempts. Please wait a minute and try again.";
  }

  if (
    message.includes("invalid") ||
    message.includes("incorrect") ||
    message.includes("password")
  ) {
    return "The current password you entered is incorrect.";
  }

  return fallback;
}
