"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { ChevronDown, SettingsIcon } from "@/components/icons/AppIcons";

export function SidebarProfile({
  userName,
  userRole,
  onNavigate,
}: {
  userName: string;
  userRole: string;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative px-3 pb-3">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${userName}, ${userRole}. Open profile menu`}
        onClick={() => setOpen((o) => !o)}
        data-state={open ? "open" : "closed"}
        className="group flex w-full items-center gap-2.5 rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-2.5 py-2 text-left transition-all hover:border-[color:var(--color-border-strong)] hover:bg-[color:var(--color-surface-2)] data-[state=open]:border-[color:var(--color-brand-300)] data-[state=open]:bg-[color:var(--color-surface-2)]"
      >
        <Avatar name={userName} size={34} />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[13px] font-semibold text-[color:var(--color-text)]">
            {userName}
          </p>
          <p className="truncate text-[11px] text-[color:var(--color-text-secondary)]">
            {userRole}
          </p>
        </div>
        <ChevronDown
          size={14}
          className={`shrink-0 text-[color:var(--color-text-muted)] transition-transform duration-200 ${
            open ? "rotate-0" : "rotate-180"
          }`}
        />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Profile"
          className="absolute bottom-full left-3 right-3 z-50 mb-1.5 overflow-hidden rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-1 shadow-[var(--shadow-dropdown)]"
        >
          <div className="flex items-center gap-2.5 px-2 py-2">
            <Avatar name={userName} size={36} />
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[13px] font-semibold text-[color:var(--color-text)]">
                {userName}
              </p>
              <p className="truncate text-[11px] text-[color:var(--color-text-secondary)]">
                {userRole}
              </p>
            </div>
          </div>
          <div
            className="my-1 h-px bg-[color:var(--color-border)]"
            role="separator"
          />
          <Link
            href="/settings"
            role="menuitem"
            onClick={() => {
              close();
              onNavigate?.();
            }}
            className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[13px] font-medium text-[color:var(--color-text)] transition-colors outline-none hover:bg-[color:var(--color-surface-2)] focus:bg-[color:var(--color-surface-2)]"
          >
            <SettingsIcon
              size={16}
              className="shrink-0 text-[color:var(--color-text-muted)]"
            />
            Account &amp; settings
          </Link>
          <div
            className="my-1 h-px bg-[color:var(--color-border)]"
            role="separator"
          />
          <Link
            href="/login"
            role="menuitem"
            onClick={() => {
              close();
              onNavigate?.();
            }}
            className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[13px] font-medium text-[color:var(--color-text-secondary)] transition-colors outline-none hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-error)] focus:bg-[color:var(--color-surface-2)]"
          >
            Log out
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export function CollapsedSidebarProfile({ userName }: { userName: string }) {
  return (
    <div className="flex flex-col items-center gap-2 border-t border-[color:var(--color-border)] py-3">
      <Link
        href="/settings"
        aria-label={`${userName} — open settings`}
        title={userName}
        className="inline-flex items-center justify-center rounded-full ring-2 ring-transparent transition-shadow hover:ring-[color:var(--color-brand-200)]"
      >
        <Avatar name={userName} size={32} />
      </Link>
    </div>
  );
}
