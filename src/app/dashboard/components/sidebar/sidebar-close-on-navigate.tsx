"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";

/** Closes the mobile sheet sidebar when the route changes. */
export function DashboardSidebarCloseOnNavigate() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);

  return null;
}
