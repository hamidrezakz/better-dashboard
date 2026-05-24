"use client";

import { Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";

/** Closes the mobile sheet sidebar when the route changes. */
function DashboardSidebarCloseOnNavigateInner() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);

  return null;
}

/** `usePathname()` must render inside Suspense for static/PPR routes. */
export function DashboardSidebarCloseOnNavigate() {
  return (
    <Suspense fallback={null}>
      <DashboardSidebarCloseOnNavigateInner />
    </Suspense>
  );
}
