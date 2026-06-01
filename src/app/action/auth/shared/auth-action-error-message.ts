function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message.toLowerCase();
  }

  if (typeof error === "string") {
    return error.toLowerCase();
  }

  return "";
}

export function getAuthActionErrorMessage({
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
    message.includes("credential") ||
    message.includes("password")
  ) {
    return "ایمیل یا رمز عبور اشتباه است.";
  }

  if (
    message.includes("already") ||
    message.includes("exist") ||
    message.includes("duplicate")
  ) {
    return "حسابی با این ایمیل از قبل وجود دارد.";
  }

  return fallback;
}
