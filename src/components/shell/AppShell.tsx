"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AddCandidateModal } from "@/components/add-candidate/AddCandidateModal";
import { Sidebar } from "@/components/shell/Sidebar";
import { Topbar } from "@/components/shell/Topbar";

export function AppShell({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addCandidateOpen, setAddCandidateOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  return (
    <div className="flex min-h-screen bg-[color:var(--color-bg-base)]">
      <Sidebar
        drawerOpen={drawerOpen}
        onCloseDrawer={() => setDrawerOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onOpenDrawer={() => setDrawerOpen(true)}
          onAddCandidate={() => setAddCandidateOpen(true)}
        />
        <main className="flex-1">{children}</main>
      </div>

      <AddCandidateModal
        open={addCandidateOpen}
        onClose={() => setAddCandidateOpen(false)}
      />
    </div>
  );
}
