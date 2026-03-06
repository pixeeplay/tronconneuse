"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageview } from "@/lib/analytics";

/** Tracks pageviews on route changes */
export function PageviewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackPageview();
  }, [pathname]);

  return null;
}
