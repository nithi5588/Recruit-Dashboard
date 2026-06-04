"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Moon, Sun1, UserSearch } from "iconsax-reactjs";
import { Wordmark } from "@/components/brand/Wordmark";
import {
  CollapsedSidebarProfile,
  SidebarProfile,
} from "@/components/shell/SidebarProfile";
import { useRole } from "@/components/role/RoleProvider";
import { canAccess } from "@/lib/roles";
import { currentUser } from "@/lib/owner-dashboard-data";
import { useTheme } from "@/components/theme/ThemeProvider";
import {
  BriefcaseIcon,
  CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClientsIcon,
  FinancialsIcon,
  HomeIcon,
  MatchIcon,
  MenuListIcon,
  ReportsIcon,
  SettingsIcon,
  SparklesIcon,
  TasksIcon,
  TeamIcon,
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

type NavSection = {
  id: string;
  heading: string;
  items: NavEntry[];
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

// "Bench" = the pool of available talent waiting to be marketed — drawn as a
// simple bench/seat to match the nav design.
function BenchNavIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M4 10V8.5A1.5 1.5 0 0 1 5.5 7h13A1.5 1.5 0 0 1 20 8.5V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M5 10v7M19 10v7M5 14h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const navSections: NavSection[] = [
  {
    id: "main",
    heading: "Main",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: <HomeIcon size={18} /> },
      { label: "Candidates", href: "/candidates", icon: <UsersIcon size={18} /> },
      { label: "Jobs", href: "/jobs", icon: <BriefcaseIcon size={18} /> },
      { label: "Matches", href: "/matches", icon: <MatchIcon size={18} /> },
      { label: "Pipeline", href: "/pipeline", icon: <PipelineNavIcon size={18} /> },
      { label: "Bench", href: "/bench", icon: <BenchNavIcon size={18} /> },
      { label: "Clients", href: "/clients", icon: <ClientsIcon size={18} /> },
      { label: "Enrichment", href: "/enrichment", icon: <EnrichmentIcon size={18} /> },
    ],
  },
  {
    id: "business",
    heading: "Business",
    items: [
      { label: "Financials", href: "/financials", icon: <FinancialsIcon size={18} /> },
      { label: "Team", href: "/team", icon: <TeamIcon size={18} /> },
      { label: "Reports", href: "/reports", icon: <ReportsIcon size={18} /> },
    ],
  },
  {
    id: "workspace",
    heading: "Workspace",
    items: [
      { label: "Calendar", href: "/calendar", icon: <CalendarIcon size={18} /> },
      { label: "Tasks", href: "/tasks", icon: <TasksIcon size={18} /> },
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
    ],
  },
  {
    id: "settings",
    heading: "Settings",
    items: [
      { label: "Settings", href: "/settings", icon: <SettingsIcon size={18} /> },
    ],
  },
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
        className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--color-brand-500)] text-white shadow-[0_6px_16px_-4px_rgba(91, 61, 245,0.45)] transition-transform hover:scale-105 active:scale-95"
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
            ? "bg-[color:var(--color-brand-500)] text-white shadow-[0_4px_12px_-2px_rgba(91, 61, 245,0.45)]"
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
            ? "bg-[color:var(--color-brand-500)] text-white shadow-[0_4px_12px_-2px_rgba(91, 61, 245,0.45)]"
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
            boxShadow: "0 4px 10px rgba(91, 61, 245, 0.30)",
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
  userImage,
  items,
}: {
  onToggleCollapse: () => void;
  userName: string;
  userImage?: string;
  items: NavEntry[];
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
            boxShadow: "0 6px 16px rgba(91, 61, 245, 0.28)",
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
        {items.map((item) => {
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
      <CollapsedSidebarProfile userName={userName} userImage={userImage} />
    </>
  );
}

function ExpandedSidebar({
  onNavigate,
  onToggleCollapse,
  userName,
  userRole,
  userImage,
  sections,
}: {
  onNavigate?: () => void;
  onToggleCollapse?: () => void;
  userName: string;
  userRole: string;
  userImage?: string;
  sections: NavSection[];
}) {
  const pathname = usePathname() ?? "";

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  // The section that holds the current page — always kept open so its active
  // item stays visible regardless of the user's collapse choices.
  const activeSectionId = sections.find((s) =>
    s.items.some((item) => isActive(item.href)),
  )?.id;

  // Only "Main" is expanded by default; the rest start collapsed.
  const [openSet, setOpenSet] = useState<Set<string>>(() => new Set(["main"]));
  const toggleSection = (id: string) =>
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

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

      {/* Scrollable nav area — grouped into collapsible labelled sections */}
      <nav
        aria-label="Primary"
        className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-3 pb-2"
      >
        {sections.map((section) => {
          const open = openSet.has(section.id) || section.id === activeSectionId;
          const panelId = `nav-section-${section.id}`;
          return (
            <div key={section.id} className="flex flex-col">
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => toggleSection(section.id)}
                className="group flex items-center gap-1.5 rounded-[8px] px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.10em] text-[color:var(--color-text-muted)] transition-colors hover:text-[color:var(--color-text-secondary)]"
              >
                <span className="flex-1 text-left">{section.heading}</span>
                <ChevronDown
                  size={13}
                  className={`shrink-0 transition-transform duration-200 ${
                    open ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>

              {/* Smooth height collapse via grid-rows trick */}
              <div
                id={panelId}
                className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-col gap-[2px] pt-0.5">
                    {section.items.map((item) => (
                      <NavItem
                        key={item.href}
                        entry={item}
                        active={isActive(item.href)}
                        onNavigate={onNavigate}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      <ProPlanCard onNavigate={onNavigate ?? onToggleCollapse} />
      <div className="px-3 pb-2">
        <ThemeToggle />
      </div>
      <SidebarProfile
        userName={userName}
        userRole={userRole}
        userImage={userImage}
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
  userName = currentUser.name,
  userImage = currentUser.image,
}: {
  drawerOpen: boolean;
  onCloseDrawer: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  userName?: string;
  userImage?: string;
}) {
  const { role, def } = useRole();
  // The visible nav is driven entirely by the active role: keep only the
  // items each role can reach, then drop any section left with no items.
  const sections = navSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => canAccess(role, item.href)),
    }))
    .filter((section) => section.items.length > 0);
  const items = sections.flatMap((section) => section.items);
  const userRole = def.label;

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
            userImage={userImage}
            items={items}
          />
        ) : (
          <ExpandedSidebar
            onToggleCollapse={onToggleCollapse}
            userName={userName}
            userRole={userRole}
            userImage={userImage}
            sections={sections}
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
          userImage={userImage}
          sections={sections}
        />
      </aside>
    </>
  );
}
