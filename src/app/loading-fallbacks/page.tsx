import { DashboardLayoutFallback } from "@/app/dashboard/components/shell/dashboard-layout-fallback";
import { DashboardPageShell } from "@/app/dashboard/components/shell/dashboard-page-shell";
import {
  CardLoadingFallback,
  LoadingFallback,
} from "@/components/loading-fallback";

export default function LoadingFallbacksPreviewPage() {
  return (
    <DashboardPageShell className="gap-10 pb-16">
      <div>
        <h1 className="text-base font-semibold">Loading fallbacks</h1>
        <p className="text-sm text-muted-foreground">
          The outer layer uses the same dashboard layout (sidebar skeleton +
          header). Route:{" "}
          <code className="text-xs">/loading-fallbacks</code>
        </p>
      </div>

      <PreviewSection title="LoadingFallback — small block (partial page)">
        <div className="h-40 rounded-lg border border-dashed border-border">
          <LoadingFallback />
        </div>
      </PreviewSection>

      <PreviewSection title="LoadingFallback — with label">
        <div className="h-44 rounded-lg border border-dashed border-border">
          <LoadingFallback label="Loading..." />
        </div>
      </PreviewSection>

      <PreviewSection title="LoadingFallback — fill height (dashboard content)">
        <div className="flex h-64 flex-col rounded-lg border border-dashed border-border">
          <LoadingFallback className="flex-1" />
        </div>
      </PreviewSection>

      <PreviewSection title="CardLoadingFallback">
        <PreviewCardFrame>
          <CardLoadingFallback />
        </PreviewCardFrame>
      </PreviewSection>

      <PreviewSection title="CardLoadingFallback — with label (join page)">
        <PreviewCardFrame>
          <CardLoadingFallback label="Loading..." />
        </PreviewCardFrame>
      </PreviewSection>

      <PreviewSection title="DashboardLayoutFallback — full layout Suspense">
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
