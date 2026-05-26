"use client";

import { SegmentErrorFallback } from "@/components/error-fallback/segment-error-fallback";

type JoinErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function JoinError({ error, reset }: JoinErrorProps) {
  return (
    <SegmentErrorFallback
      title="Could not load invitation"
      description="Something went wrong while loading this invitation. You can try again."
      error={error}
      reset={reset}
    />
  );
}
