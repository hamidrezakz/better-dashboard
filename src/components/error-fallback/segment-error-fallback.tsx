"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SegmentErrorFallbackProps = {
  title: string;
  description: string;
  error: Error & { digest?: string };
  reset: () => void;
};

export function SegmentErrorFallback({
  title,
  description,
  error,
  reset,
}: SegmentErrorFallbackProps) {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {process.env.NODE_ENV === "development" && error.message ? (
            <p className="text-sm text-muted-foreground">{error.message}</p>
          ) : null}
          <Button type="button" onClick={reset}>
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
