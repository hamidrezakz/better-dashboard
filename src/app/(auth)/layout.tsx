import { Card, CardContent } from "@/components/ui/card";
import { Building2Icon } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="p-6 md:p-8">{children}</div>
            <div className="relative hidden items-center justify-center bg-primary/5 md:flex">
              <Building2Icon className="size-36 text-primary/30" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
