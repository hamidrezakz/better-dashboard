"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type CopyableUrlFieldProps = {
  url: string;
  label?: string;
  className?: string;
};

const COPY_FEEDBACK_MS = 1000;

export function CopyableUrlField({
  url,
  label,
  className,
}: CopyableUrlFieldProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }
    const timeoutId = window.setTimeout(
      () => setCopied(false),
      COPY_FEEDBACK_MS,
    );
    return () => window.clearTimeout(timeoutId);
  }, [copied]);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }, [url]);

  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? <p className="text-sm text-muted-foreground">{label}</p> : null}
      <div className="flex items-center gap-2">
        <Input
          readOnly
          value={url}
          dir="ltr"
          className="min-w-0 flex-1 font-mono text-xs"
          onFocus={(event) => event.currentTarget.select()}
          onClick={(event) => event.currentTarget.select()}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0"
          onClick={onCopy}
          aria-label={copied ? "کپی شد" : "کپی لینک"}
        >
          {copied ? (
            <CheckIcon className="text-primary" aria-hidden />
          ) : (
            <CopyIcon aria-hidden />
          )}
        </Button>
      </div>
      {copied ? (
        <p className="text-xs text-muted-foreground" aria-live="polite">
          کپی شد
        </p>
      ) : null}
    </div>
  );
}
