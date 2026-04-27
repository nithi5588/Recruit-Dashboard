"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { ChevronDown } from "@/components/icons/AppIcons";

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
          className="profile-menu absolute bottom-full left-3 right-3 z-50 mb-2 overflow-hidden rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-dropdown)]"
        >
          <style>{`
            .profile-menu {
              animation: pm-pop 180ms cubic-bezier(.2,.7,.2,1);
              transform-origin: bottom center;
            }
            @keyframes pm-pop {
              from { opacity: 0; transform: translateY(6px) scale(.98); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
            @media (prefers-reduced-motion: reduce) {
              .profile-menu { animation: none; }
            }
            .pm-online-dot {
              position: absolute; right: -2px; bottom: -2px;
              width: 10px; height: 10px; border-radius: 50%;
              background: var(--color-success);
              border: 2px solid var(--color-surface);
            }
            .pm-item {
              display: flex; align-items: center; gap: 10px;
              padding: 10px 10px; border-radius: 10px;
              font-size: 13px; font-weight: 500;
              color: var(--color-text);
              outline: none;
              transition: background 130ms ease, color 130ms ease, transform 130ms ease;
            }
            .pm-item:hover, .pm-item:focus-visible {
              background: var(--color-surface-2);
              color: var(--color-text);
            }
            .pm-item:active { transform: translateY(1px); }
            .pm-icon {
              display: inline-flex; align-items: center; justify-content: center;
              width: 22px; height: 22px; flex-shrink: 0;
              color: var(--color-text-muted);
              transition: color 130ms ease;
            }
            .pm-item:hover .pm-icon, .pm-item:focus-visible .pm-icon {
              color: var(--color-text-secondary);
            }
            .pm-danger:hover, .pm-danger:focus-visible {
              background: var(--color-error-light, #FDECEC);
              color: var(--color-error, #DC2626);
            }
            .pm-danger:hover .pm-icon, .pm-danger:focus-visible .pm-icon {
              color: var(--color-error, #DC2626);
            }
          `}</style>

          {/* Header */}
          <div className="border-b border-[color:var(--color-border)] px-3 py-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar name={userName} size={38} />
                <span className="pm-online-dot" aria-label="Online" />
              </div>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-[14px] font-semibold text-[color:var(--color-text)]">
                  {userName}
                </p>
                <p className="mt-0.5 truncate text-[11.5px] text-[color:var(--color-text-secondary)]">
                  {userRole}
                </p>
              </div>
            </div>
          </div>

          {/* Single action */}
          <div className="p-1.5">
            <Link
              href="/login"
              role="menuitem"
              onClick={() => {
                close();
                onNavigate?.();
              }}
              className="pm-item pm-danger"
            >
              <span className="pm-icon" aria-hidden>
                <svg
                  width={14}
                  height={14}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </span>
              <span>Log out</span>
            </Link>
          </div>
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
