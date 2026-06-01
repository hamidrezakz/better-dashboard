"use client";

import { SegmentErrorFallback } from "@/components/error-fallback/segment-error-fallback";

type JoinErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function JoinError({ error, reset }: JoinErrorProps) {
  return (
    <SegmentErrorFallback
      title="بارگذاری دعوت‌نامه ممکن نشد"
      description="هنگام بارگذاری این دعوت‌نامه خطایی رخ داد. می‌توانید دوباره امتحان کنید."
      error={error}
      reset={reset}
    />
  );
}
