"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Moon, Sun1, UserSearch } from "iconsax-reactjs";
import { Wordmark } from "@/components/brand/Wordmark";
import {
  CollapsedSidebarProfile,
  SidebarProfile,
} from "@/components/shell/SidebarProfile";
import { useTheme } from "@/components/theme/ThemeProvider";
import {
  BriefcaseIcon,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ClientsIcon,
  HomeIcon,
  MatchIcon,
  MenuListIcon,
  ReportsIcon,
  SettingsIcon,
  SparklesIcon,
  TasksIcon,
  UsersIcon,
} from "@/components/icons/AppIcons";

function EnrichmentIcon({ size = 18 }: { size?: number }) {
  return <UserSearch size={size} color="currentColor" variant="Linear" />;
}
type NavEntry = {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: ReactNode;
};

function PipelineNavIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5"  y="4" width="4" height="16" rx="1.4" stroke="currentColor" strokeWidth="1.6" />
      <rect x="10"   y="4" width="4" height="11" rx="1.4" stroke="currentColor" strokeWidth="1.6" />
      <rect x="16.5" y="4" width="4"  height="7" rx="1.4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

const navItems: NavEntry[] = [
  { label: "Dashboard", href: "/dashboard", icon: <HomeIcon size={18} /> },
  { label: "Candidates", href: "/candidates", icon: <UsersIcon size={18} /> },
  { label: "Jobs", href: "/jobs", icon: <BriefcaseIcon size={18} /> },
  { label: "Matches", href: "/matches", icon: <MatchIcon size={18} /> },
  { label: "Pipeline", href: "/pipeline", icon: <PipelineNavIcon size={18} /> },
  { label: "Enrichment", href: "/enrichment", icon: <EnrichmentIcon size={18} /> },
  {
    label: "Clients",
    href: "/clients",
    icon: <ClientsIcon size={18} />,
    badge: (
      <span
        className="inline-flex items-center rounded-[5px] px-[6px] py-[2px] text-[9px] font-bold uppercase tracking-wider text-white"
        style={{ background: "#D97706" }}
      >
        Soon
      </span>
    ),
  },
  { label: "Calendar", href: "/calendar", icon: <CalendarIcon size={18} /> },
  { label: "Tasks", href: "/tasks", icon: <TasksIcon size={18} /> },
  {
    label: "Reports",
    href: "/reports",
    icon: <ReportsIcon size={18} />,
    badge: (
      <span
        className="inline-flex items-center rounded-[5px] px-[6px] py-[2px] text-[9px] font-bold uppercase tracking-wider text-white"
        style={{ background: "var(--color-brand-500)" }}
      >
        New
      </span>
    ),
  },
  {
    label: "AI Assistant",
    href: "/assistant",
    icon: <SparklesIcon size={18} />,
    badge: (
      <span
        className="inline-flex items-center rounded-[5px] px-[6px] py-[2px] text-[9px] font-bold uppercase tracking-wider text-white"
        style={{ background: "var(--color-brand-500)" }}
      >
        Beta
      </span>
    ),
  },
  { label: "Settings", href: "/settings", icon: <SettingsIcon size={18} /> },
];

function NavItem({
  entry,
  active,
  onNavigate,
}: {
  entry: NavEntry;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={entry.href}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={`group relative flex h-[42px] items-center gap-3 rounded-full px-3.5 text-[13.5px] transition-all duration-200 ease-out ${
        active
          ? "nav-item-active font-semibold"
          : "font-medium text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
      }`}
    >
      <span
        className={`shrink-0 transition-colors duration-150 ${
          active
            ? "text-white"
            : "text-[color:var(--color-text-muted)] group-hover:text-[color:var(--color-text-secondary)]"
        }`}
      >
        {entry.icon}
      </span>
      <span className="flex-1 truncate">{entry.label}</span>
      {entry.badge}
    </Link>
  );
}

function ThemeToggle({ collapsed = false }: { collapsed?: boolean }) {
  const { setTheme, resolvedTheme } = useTheme();
  // Surface a binary toggle that respects system if user hasn't picked a side.
  const isDark = resolvedTheme === "dark";

  if (collapsed) {
    return (
      <button
        type="button"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        title={isDark ? "Light mode" : "Dark mode"}
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--color-brand-500)] text-white shadow-[0_6px_16px_-4px_rgba(46,71,224,0.45)] transition-transform hover:scale-105 active:scale-95"
      >
        {isDark ? <Sun1 size={16} variant="Bulk" /> : <Moon size={16} variant="Bulk" />}
      </button>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className="flex h-9 w-full items-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] p-1"
    >
      <button
        type="button"
        role="radio"
        aria-checked={!isDark}
        aria-label="Light mode"
        onClick={() => setTheme("light")}
        className={`flex h-7 flex-1 items-center justify-center gap-1.5 rounded-full text-[11px] font-semibold transition-all duration-200 ${
          !isDark
            ? "bg-[color:var(--color-brand-500)] text-white shadow-[0_4px_12px_-2px_rgba(46,71,224,0.45)]"
            : "text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-secondary)]"
        }`}
      >
        <Sun1 size={13} variant={!isDark ? "Bulk" : "Linear"} />
        <span className="hidden sm:inline">Light</span>
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={isDark}
        aria-label="Dark mode"
        onClick={() => setTheme("dark")}
        className={`flex h-7 flex-1 items-center justify-center gap-1.5 rounded-full text-[11px] font-semibold transition-all duration-200 ${
          isDark
            ? "bg-[color:var(--color-brand-500)] text-white shadow-[0_4px_12px_-2px_rgba(46,71,224,0.45)]"
            : "text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-secondary)]"
        }`}
      >
        <Moon size={13} variant={isDark ? "Bulk" : "Linear"} />
        <span className="hidden sm:inline">Dark</span>
      </button>
    </div>
  );
}

function ProPlanCard({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="pro-card-wrap px-3 pb-3">
      <Link
        href="/pricing"
        onClick={onNavigate}
        className="pro-card group flex items-center gap-2.5 rounded-[10px] border px-2.5 py-2 transition-all hover:-translate-y-[1px]"
      >
        <span
          aria-hidden
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] text-white"
          style={{
            background: "var(--color-brand-500)",
            boxShadow: "0 4px 10px rgba(46, 71, 224, 0.30)",
          }}
        >
          <SparklesIcon size={13} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="pro-card-title text-[12px] font-semibold leading-tight">
            Upgrade to Pro
          </p>
          <p className="pro-card-sub truncate text-[11px]">
            Unlock the full platform
          </p>
        </div>
        <span
          aria-hidden
          className="pro-card-arrow shrink-0 transition-transform group-hover:translate-x-0.5"
        >
          <ChevronRight size={14} />
        </span>
      </Link>
    </div>
  );
}

function CollapsedSidebar({
  onToggleCollapse,
  userName,
}: {
  onToggleCollapse: () => void;
  userName: string;
}) {
  const pathname = usePathname() ?? "";

  return (
    <>
      <div className="flex flex-col items-center gap-3 border-b border-[color:var(--color-border)] px-2 py-4">
        <span
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-white"
          style={{
            background: "var(--color-brand-500)",
            boxShadow: "0 6px 16px rgba(46, 71, 224, 0.28)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 2.5L11.5 7L3 11.5V2.5Z" fill="currentColor" />
          </svg>
        </span>
        <button
          type="button"
          aria-label="Expand sidebar"
          onClick={onToggleCollapse}
          className="flex h-7 w-7 items-center justify-center rounded-[7px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-brand-500)]"
        >
          <ChevronRight size={15} />
        </button>
      </div>

      <nav
        aria-label="Primary"
        className="flex flex-1 flex-col items-center gap-1 overflow-y-auto px-2 py-3"
      >
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href + "/"));
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              title={item.label}
              aria-current={active ? "page" : undefined}
              className={`relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 ease-out ${
                active
                  ? "nav-item-active text-white"
                  : "text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-secondary)]"
              }`}
            >
              {item.icon}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col items-center gap-2 border-t border-[color:var(--color-border)] py-3">
        <ThemeToggle collapsed />
      </div>
      <CollapsedSidebarProfile userName={userName} />
    </>
  );
}

function ExpandedSidebar({
  onNavigate,
  onToggleCollapse,
  userName,
  userRole,
}: {
  onNavigate?: () => void;
  onToggleCollapse?: () => void;
  userName: string;
  userRole: string;
}) {
  const pathname = usePathname() ?? "";

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-[14px]">
        <Wordmark />
        <button
          type="button"
          aria-label={onNavigate ? "Close sidebar" : "Collapse sidebar"}
          onClick={onNavigate ?? onToggleCollapse}
          className="flex h-8 w-8 items-center justify-center rounded-[8px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-secondary)]"
        >
          {onNavigate ? <MenuListIcon size={18} /> : <ChevronLeft size={17} />}
        </button>
      </div>

      {/* Scrollable nav area */}
      <nav
        aria-label="Primary"
        className="flex flex-1 flex-col overflow-y-auto px-3 pb-2"
      >
        {/* Main nav */}
        <div className="flex flex-col gap-[2px]">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href + "/"));
            return (
              <NavItem
                key={item.href}
                entry={item}
                active={active}
                onNavigate={onNavigate}
              />
            );
          })}
        </div>
      </nav>

      <ProPlanCard onNavigate={onNavigate ?? onToggleCollapse} />
      <div className="px-3 pb-2">
        <ThemeToggle />
      </div>
      <SidebarProfile
        userName={userName}
        userRole={userRole}
        onNavigate={onNavigate}
      />
    </>
  );
}

export function Sidebar({
  drawerOpen,
  onCloseDrawer,
  collapsed,
  onToggleCollapse,
  userName = "Nithish",
  userRole = "Recruiter",
}: {
  drawerOpen: boolean;
  onCloseDrawer: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  userName?: string;
  userRole?: string;
}) {
  return (
    <>
      {/* Desktop sidebar — FLOATING, detached from the screen edges with
         a 12px gap, fully rounded, on a soft drop shadow. The main content
         padding tracks --sidebar-w + the floating gap (see globals.css). */}
      <aside
        style={{
          width: collapsed ? "72px" : "260px",
          top: "12px",
          left: "12px",
          bottom: "12px",
          height: "calc(100vh - 24px)",
          transition:
            "width 240ms cubic-bezier(0.22, 0.94, 0.46, 1), background-color 200ms ease, border-color 200ms ease",
        }}
        className="sidebar-glass fixed z-40 hidden flex-col overflow-hidden lg:flex"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <span className="sidebar-glass-orb sidebar-glass-orb-1" />
          <span className="sidebar-glass-orb sidebar-glass-orb-2" />
        </div>

        {collapsed ? (
          <CollapsedSidebar
            onToggleCollapse={onToggleCollapse}
            userName={userName}
          />
        ) : (
          <ExpandedSidebar
            onToggleCollapse={onToggleCollapse}
            userName={userName}
            userRole={userRole}
          />
        )}
      </aside>

      {/* Mobile drawer overlay — light enough that you can still see the
         page behind it, but with a soft blur for depth. */}
      <div
        aria-hidden={!drawerOpen}
        className={`fixed inset-0 z-40 bg-black/15 backdrop-blur-[1.5px] transition-opacity duration-200 lg:hidden ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onCloseDrawer}
      />

      {/* Mobile drawer panel — real backdrop-blur glass */}
      <aside
        aria-label="Sidebar"
        aria-hidden={!drawerOpen}
        style={{
          transition:
            "transform 280ms cubic-bezier(0.22, 0.94, 0.46, 1), box-shadow 200ms ease",
        }}
        className={`sidebar-glass-drawer fixed inset-y-0 left-0 z-50 flex h-screen w-[280px] max-w-[85vw] flex-col overflow-hidden lg:hidden ${
          drawerOpen
            ? "translate-x-0 shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
            : "-translate-x-full shadow-none"
        }`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <span className="sidebar-glass-orb sidebar-glass-orb-1" />
          <span className="sidebar-glass-orb sidebar-glass-orb-2" />
        </div>
        <ExpandedSidebar
          onNavigate={onCloseDrawer}
          userName={userName}
          userRole={userRole}
        />
      </aside>
    </>
  );
}
