"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// Re-keys on pathname change so the entrance animation replays on each
// client-side route change. Pure CSS — no JS animation runtime cost.
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="fx-page-enter">
      {children}
    </div>
  );
}
