import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function RequiredMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("text-destructive leading-none", className)}
    >
      *
    </span>
  );
}

type FormLabelProps = React.ComponentProps<typeof Label> & {
  required?: boolean;
};

export function FormLabel({
  required = false,
  children,
  className,
  ...props
}: FormLabelProps) {
  return (
    <Label className={cn("gap-1", className)} {...props}>
      {children}
      {required ? <RequiredMark /> : null}
    </Label>
  );
}
