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

  // Desktop sidebar is FIXED so the page content scrolls behind its
  // glass surface. We expose the current sidebar width as a CSS variable
  // and the content wrapper picks it up as its left padding (only on lg+).
  const sidebarPx = sidebarCollapsed ? 72 : 260;

  return (
    <div
      className="min-h-screen bg-[color:var(--color-bg-base)]"
      style={{ ["--sidebar-w" as string]: `${sidebarPx}px` }}
    >
      <Sidebar
        drawerOpen={drawerOpen}
        onCloseDrawer={() => setDrawerOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
      />
      <div
        className="shell-padded flex min-h-screen flex-col"
        style={{
          transition: "padding-left 240ms cubic-bezier(0.22, 0.94, 0.46, 1)",
        }}
      >
        <Topbar
          onOpenDrawer={() => setDrawerOpen(true)}
          onAddCandidate={() => setAddCandidateOpen(true)}
        />
        <main className="min-w-0 flex-1">{children}</main>
      </div>

      <AddCandidateModal
        open={addCandidateOpen}
        onClose={() => setAddCandidateOpen(false)}
      />
    </div>
  );
}
