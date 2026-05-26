"use client";

import { SegmentErrorFallback } from "@/components/error-fallback/segment-error-fallback";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  return (
    <SegmentErrorFallback
      title="Something went wrong"
      description="We could not load this dashboard page. You can try again."
      error={error}
      reset={reset}
    />
  );
}
