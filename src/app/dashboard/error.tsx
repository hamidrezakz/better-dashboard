"use client";

import { SegmentErrorFallback } from "@/components/error-fallback/segment-error-fallback";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  return (
    <SegmentErrorFallback
      title="خطایی رخ داد"
      description="بارگذاری این صفحه داشبورد ممکن نشد. می‌توانید دوباره امتحان کنید."
      error={error}
      reset={reset}
    />
  );
}
