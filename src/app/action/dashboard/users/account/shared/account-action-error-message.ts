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
    return "تلاش‌های زیاد. یک دقیقه صبر کنید و دوباره امتحان کنید.";
  }

  if (
    message.includes("invalid") ||
    message.includes("incorrect") ||
    message.includes("password")
  ) {
    return "رمز عبور فعلی اشتباه است.";
  }

  return fallback;
}
