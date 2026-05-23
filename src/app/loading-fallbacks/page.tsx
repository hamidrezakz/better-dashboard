import { DashboardLayoutFallback } from "@/app/dashboard/components/dashboard-layout-fallback";
import { DashboardPageShell } from "@/app/dashboard/components/dashboard-page-shell";
import {
  CardLoadingFallback,
  LoadingFallback,
} from "@/components/loading-fallback";

export default function LoadingFallbacksPreviewPage() {
  return (
    <DashboardPageShell className="gap-10 pb-16">
      <div>
        <h1 className="text-base font-semibold">فالبک‌های لودینگ</h1>
        <p className="text-sm text-muted-foreground">
          لایهٔ بیرونی همان چیدمان داشبورد است (سایدبار اسکلت + هدر). مسیر:{" "}
          <code className="text-xs">/loading-fallbacks</code>
        </p>
      </div>

      <PreviewSection title="LoadingFallback — بلوک کوچک (بخشی از صفحه)">
        <div className="h-40 rounded-lg border border-dashed border-border">
          <LoadingFallback />
        </div>
      </PreviewSection>

      <PreviewSection title="LoadingFallback — با متن">
        <div className="h-44 rounded-lg border border-dashed border-border">
          <LoadingFallback label="در حال بارگذاری..." />
        </div>
      </PreviewSection>

      <PreviewSection title="LoadingFallback — پر کردن ارتفاع (مثل محتوای داشبورد)">
        <div className="flex h-64 flex-col rounded-lg border border-dashed border-border">
          <LoadingFallback className="flex-1" />
        </div>
      </PreviewSection>

      <PreviewSection title="CardLoadingFallback">
        <PreviewCardFrame>
          <CardLoadingFallback />
        </PreviewCardFrame>
      </PreviewSection>

      <PreviewSection title="CardLoadingFallback — با متن (مثل صفحه join)">
        <PreviewCardFrame>
          <CardLoadingFallback label="در حال بارگذاری..." />
        </PreviewCardFrame>
      </PreviewSection>

      <PreviewSection title="DashboardLayoutFallback — وقتی کل layout در Suspense است">
        <div className="overflow-hidden rounded-lg border border-dashed border-border">
          <DashboardLayoutFallback />
        </div>
      </PreviewSection>
    </DashboardPageShell>
  );
}

function PreviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-medium">{title}</h2>
      {children}
    </section>
  );
}

function PreviewCardFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
