"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Avatar } from "@/components/ui/Avatar";
import {
  BellIcon,
  BriefcaseIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDown,
  HomeIcon,
  MatchIcon,
  MenuListIcon,
  PlusIcon,
  ReportsIcon,
  SearchIcon,
  SettingsIcon,
  SparklesIcon,
  TasksIcon,
  UserPlusIcon,
  UsersIcon,
  XIcon,
} from "@/components/icons/AppIcons";
import { candidates as allCandidates } from "@/lib/sample-data";
import { jobs as allJobs } from "@/lib/jobs-data";

type NotificationKind = "match" | "interview" | "task" | "candidate" | "submission";

type NotificationItem = {
  id: string;
  kind: NotificationKind;
  title: string;
  description: string;
  time: string;
  href?: string;
  unread: boolean;
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    kind: "match",
    title: "5 new matches for Senior React Engineer",
    description: "Top score 94% — Aarav Mehta",
    time: "2m ago",
    href: "/matches",
    unread: true,
  },
  {
    id: "n2",
    kind: "interview",
    title: "Interview in 30 minutes",
    description: "Priya Shah · Panel round with Acme Corp",
    time: "28m ago",
    href: "/calendar",
    unread: true,
  },
  {
    id: "n3",
    kind: "task",
    title: "Follow-up overdue",
    description: "Call Rahul Verma about offer response",
    time: "1h ago",
    href: "/tasks",
    unread: true,
  },
  {
    id: "n4",
    kind: "submission",
    title: "Candidate submitted to client",
    description: "Meera Iyer → Globex · Staff Data Engineer",
    time: "3h ago",
    href: "/jobs",
    unread: true,
  },
  {
    id: "n5",
    kind: "candidate",
    title: "New candidate added",
    description: "Karthik Rao joined the Backend pool",
    time: "Yesterday",
    href: "/candidates",
    unread: false,
  },
  {
    id: "n6",
    kind: "match",
    title: "Weekly match digest ready",
    description: "18 candidates surfaced across 4 open roles",
    time: "Yesterday",
    href: "/matches",
    unread: false,
  },
];

function NotificationIcon({ kind }: { kind: NotificationKind }) {
  const map: Record<
    NotificationKind,
    { bg: string; fg: string; icon: ReactNode }
  > = {
    match: {
      bg: "bg-[color:var(--color-brand-50)]",
      fg: "text-[color:var(--color-brand-600)]",
      icon: <MatchIcon size={16} />,
    },
    interview: {
      bg: "bg-[color:var(--color-warning-50,#FFF4DB)]",
      fg: "text-[color:var(--color-warning,#F59E0B)]",
      icon: <CalendarIcon size={16} />,
    },
    task: {
      bg: "bg-[color:var(--color-error-50,#FDECEC)]",
      fg: "text-[color:var(--color-error,#EF4444)]",
      icon: <TasksIcon size={16} />,
    },
    candidate: {
      bg: "bg-[color:var(--color-info-50,#EAF2FF)]",
      fg: "text-[color:var(--color-info,#3B82F6)]",
      icon: <UserPlusIcon size={16} />,
    },
    submission: {
      bg: "bg-[color:var(--color-success-50,#EAFBF1)]",
      fg: "text-[color:var(--color-success,#22C55E)]",
      icon: <CheckIcon size={16} />,
    },
  };
  const v = map[kind];
  return (
    <span
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ${v.bg} ${v.fg}`}
      aria-hidden
    >
      {v.icon}
    </span>
  );
}

function SearchGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="px-1.5 pb-1">
      <p className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
        {label}
      </p>
      <ul>{children}</ul>
    </div>
  );
}

function SearchItem({
  result,
  active,
  onHover,
  onSelect,
  leading,
}: {
  result: SearchResult;
  active: boolean;
  onHover: () => void;
  onSelect: () => void;
  leading: ReactNode;
}) {
  return (
    <li>
      <button
        type="button"
        role="option"
        aria-selected={active}
        onMouseEnter={onHover}
        onClick={onSelect}
        className={`flex w-full items-center gap-3 rounded-[10px] px-2.5 py-2 text-left transition-colors ${
          active
            ? "bg-[color:var(--color-surface-2)]"
            : "hover:bg-[color:var(--color-surface-2)]/70"
        }`}
      >
        {leading}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-[color:var(--color-text)]">
            {result.title}
          </p>
          <p className="truncate text-[12px] text-[color:var(--color-text-secondary)]">
            {result.subtitle}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-[999px] border border-[color:var(--color-border)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            result.kind === "candidate"
              ? "text-[color:var(--color-brand-600)]"
              : result.kind === "job"
                ? "text-[#2563EB]"
                : "text-[color:var(--color-text-muted)]"
          }`}
        >
          {result.kind}
        </span>
      </button>
    </li>
  );
}

type SearchResult =
  | { kind: "candidate"; id: string; title: string; subtitle: string; href: string }
  | { kind: "job"; id: string; title: string; subtitle: string; href: string }
  | { kind: "page"; id: string; title: string; subtitle: string; href: string; icon: ReactNode };

const NAV_PAGES: SearchResult[] = [
  { kind: "page", id: "nav-dashboard", title: "Dashboard", subtitle: "Overview & priorities", href: "/dashboard", icon: <HomeIcon size={16} /> },
  { kind: "page", id: "nav-candidates", title: "Candidates", subtitle: "Browse all candidates", href: "/candidates", icon: <UsersIcon size={16} /> },
  { kind: "page", id: "nav-jobs", title: "Jobs", subtitle: "Open roles & JDs", href: "/jobs", icon: <BriefcaseIcon size={16} /> },
  { kind: "page", id: "nav-matches", title: "Matches", subtitle: "AI-powered matching", href: "/matches", icon: <MatchIcon size={16} /> },
  { kind: "page", id: "nav-calendar", title: "Calendar", subtitle: "Interviews & calls", href: "/calendar", icon: <CalendarIcon size={16} /> },
  { kind: "page", id: "nav-tasks", title: "Tasks", subtitle: "Follow-ups & to-dos", href: "/tasks", icon: <TasksIcon size={16} /> },
  { kind: "page", id: "nav-reports", title: "Reports", subtitle: "Recruiting analytics", href: "/reports", icon: <ReportsIcon size={16} /> },
  { kind: "page", id: "nav-assistant", title: "AI Assistant", subtitle: "Ask anything", href: "/assistant", icon: <SparklesIcon size={16} /> },
  { kind: "page", id: "nav-settings", title: "Settings", subtitle: "Account & team", href: "/settings", icon: <SettingsIcon size={16} /> },
];

export function Topbar({
  userName = "Nithish",
  userRole = "Recruiter",
  onOpenDrawer,
  onAddCandidate,
}: {
  userName?: string;
  userRole?: string;
  onOpenDrawer?: () => void;
  onAddCandidate?: () => void;
}) {
  const router = useRouter();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [notifFilter, setNotifFilter] = useState<"all" | "unread">("all");
  const [searchValue, setSearchValue] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const menuId = useId();
  const notifId = useId();
  const searchId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const closeProfileMenu = useCallback(() => setProfileMenuOpen(false), []);
  const closeNotif = useCallback(() => setNotifOpen(false), []);
  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setActiveIndex(0);
  }, []);

  const searchResults = useMemo<{
    candidates: SearchResult[];
    jobs: SearchResult[];
    pages: SearchResult[];
    flat: SearchResult[];
  }>(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) {
      const pages = NAV_PAGES.slice(0, 5);
      return { candidates: [], jobs: [], pages, flat: pages };
    }
    const candidateMatches: SearchResult[] = allCandidates
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.role.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q)),
      )
      .slice(0, 5)
      .map((c) => ({
        kind: "candidate" as const,
        id: c.id,
        title: c.name,
        subtitle: `${c.role} · ${c.location}`,
        href: `/candidates/${c.id}`,
      }));
    const jobMatches: SearchResult[] = allJobs
      .filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.tags.some((t) => t.toLowerCase().includes(q)),
      )
      .slice(0, 4)
      .map((j) => ({
        kind: "job" as const,
        id: j.id,
        title: j.title,
        subtitle: `${j.company} · ${j.location}`,
        href: `/jobs/${j.id}`,
      }));
    const pageMatches = NAV_PAGES.filter(
      (p) =>
        p.title.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q),
    ).slice(0, 4);
    return {
      candidates: candidateMatches,
      jobs: jobMatches,
      pages: pageMatches,
      flat: [...candidateMatches, ...jobMatches, ...pageMatches],
    };
  }, [searchValue]);

  const totalResults = searchResults.flat.length;

  const runResult = useCallback(
    (r: SearchResult | undefined) => {
      if (!r) return;
      router.push(r.href);
      setSearchValue("");
      closeSearch();
      searchInputRef.current?.blur();
    },
    [router, closeSearch],
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications],
  );
  const visibleNotifications = useMemo(
    () =>
      notifFilter === "unread"
        ? notifications.filter((n) => n.unread)
        : notifications,
    [notifications, notifFilter],
  );

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);
  const markOneRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  }, []);

  useEffect(() => {
    if (!profileMenuOpen) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [profileMenuOpen]);

  useEffect(() => {
    if (!notifOpen) return;
    function onPointerDown(e: PointerEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setNotifOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [notifOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    function onPointerDown(e: PointerEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [searchOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.platform);
      if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
        setSearchOpen(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [searchValue]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 sm:h-[72px] sm:gap-3 sm:px-6 lg:px-8">
      <button
        type="button"
        aria-label="Open sidebar"
        onClick={onOpenDrawer}
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)] lg:hidden"
      >
        <MenuListIcon />
      </button>

      <div className="relative flex-1 min-w-0" ref={searchRef}>
        <div className="relative max-w-[560px]">
          <label htmlFor={searchId} className="sr-only">
            Search
          </label>
          <span
            aria-hidden
            className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors sm:left-4 ${
              searchOpen
                ? "text-[color:var(--color-brand-500)]"
                : "text-[color:var(--color-text-muted)]"
            }`}
          >
            <SearchIcon size={18} />
          </span>
          <input
            ref={searchInputRef}
            id={searchId}
            type="text"
            role="combobox"
            autoComplete="off"
            aria-expanded={searchOpen}
            aria-controls={searchId + "-list"}
            aria-autocomplete="list"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                if (searchValue) {
                  setSearchValue("");
                } else {
                  closeSearch();
                  searchInputRef.current?.blur();
                }
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                setSearchOpen(true);
                setActiveIndex((i) =>
                  totalResults ? (i + 1) % totalResults : 0,
                );
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((i) =>
                  totalResults ? (i - 1 + totalResults) % totalResults : 0,
                );
              } else if (e.key === "Enter") {
                e.preventDefault();
                runResult(searchResults.flat[activeIndex]);
              }
            }}
            placeholder="Search candidates, jobs, skills, companies..."
            className={`h-11 w-full rounded-[12px] border bg-[color:var(--color-surface-2)] pl-10 pr-20 text-[13px] text-[color:var(--color-text)] outline-none placeholder:text-[color:var(--color-text-muted)] transition-all sm:pl-11 sm:text-[14px] ${
              searchOpen
                ? "border-[color:var(--color-brand-300)] bg-[color:var(--color-surface)] shadow-[var(--shadow-ring-brand)]"
                : "border-transparent hover:bg-[color:var(--color-surface-2)]/80 focus:bg-[color:var(--color-surface)]"
            }`}
          />
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
            {searchValue ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setSearchValue("");
                  searchInputRef.current?.focus();
                }}
                className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-secondary)]"
              >
                <XIcon size={14} />
              </button>
            ) : (
              <kbd className="pointer-events-none hidden items-center gap-0.5 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-1.5 py-0.5 text-[11px] font-medium text-[color:var(--color-text-muted)] md:flex">
                <span aria-hidden>⌘</span>
                <span>K</span>
              </kbd>
            )}
          </div>
        </div>

        {searchOpen ? (
          <div
            id={searchId + "-list"}
            role="listbox"
            className="absolute left-0 top-full z-40 mt-2 w-full max-w-[560px] overflow-hidden rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[0_20px_48px_rgba(15,16,20,0.14)]"
          >
            {totalResults === 0 ? (
              <div className="flex flex-col items-center gap-1 px-4 py-10 text-center">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--color-surface-2)] text-[color:var(--color-text-muted)]">
                  <SearchIcon size={18} />
                </span>
                <p className="text-[13px] font-semibold text-[color:var(--color-text)]">
                  No results for &ldquo;{searchValue}&rdquo;
                </p>
                <p className="text-[12px] text-[color:var(--color-text-secondary)]">
                  Try a different name, skill, or job title.
                </p>
              </div>
            ) : (
              <div className="max-h-[min(70vh,480px)] overflow-y-auto py-1.5">
                {searchResults.candidates.length > 0 ? (
                  <SearchGroup label="Candidates">
                    {searchResults.candidates.map((r) => {
                      const idx = searchResults.flat.indexOf(r);
                      return (
                        <SearchItem
                          key={r.id}
                          result={r}
                          active={idx === activeIndex}
                          onHover={() => setActiveIndex(idx)}
                          onSelect={() => runResult(r)}
                          leading={
                            <Avatar name={r.title} size={30} />
                          }
                        />
                      );
                    })}
                  </SearchGroup>
                ) : null}

                {searchResults.jobs.length > 0 ? (
                  <SearchGroup label="Jobs">
                    {searchResults.jobs.map((r) => {
                      const idx = searchResults.flat.indexOf(r);
                      return (
                        <SearchItem
                          key={r.id}
                          result={r}
                          active={idx === activeIndex}
                          onHover={() => setActiveIndex(idx)}
                          onSelect={() => runResult(r)}
                          leading={
                            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[color:var(--color-brand-50)] text-[color:var(--color-brand-600)]">
                              <BriefcaseIcon size={15} />
                            </span>
                          }
                        />
                      );
                    })}
                  </SearchGroup>
                ) : null}

                {searchResults.pages.length > 0 ? (
                  <SearchGroup
                    label={searchValue ? "Pages" : "Quick navigation"}
                  >
                    {searchResults.pages.map((r) => {
                      const idx = searchResults.flat.indexOf(r);
                      return (
                        <SearchItem
                          key={r.id}
                          result={r}
                          active={idx === activeIndex}
                          onHover={() => setActiveIndex(idx)}
                          onSelect={() => runResult(r)}
                          leading={
                            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[color:var(--color-surface-2)] text-[color:var(--color-text-secondary)]">
                              {"icon" in r ? r.icon : <SearchIcon size={14} />}
                            </span>
                          }
                        />
                      );
                    })}
                  </SearchGroup>
                ) : null}
              </div>
            )}

            <div className="flex items-center justify-between gap-3 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/50 px-3 py-2 text-[11px] text-[color:var(--color-text-muted)]">
              <div className="flex items-center gap-2">
                <kbd className="rounded border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-1.5 py-0.5 font-medium">↵</kbd>
                <span>open</span>
                <kbd className="ml-2 rounded border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-1.5 py-0.5 font-medium">↑↓</kbd>
                <span>navigate</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="rounded border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-1.5 py-0.5 font-medium">esc</kbd>
                <span>close</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <button
        type="button"
        aria-label="Add candidate"
        onClick={onAddCandidate}
        className="inline-flex h-11 shrink-0 items-center gap-2 rounded-[12px] bg-[color:var(--color-brand-500)] px-3 text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(91,61,245,0.25)] transition-colors hover:bg-[color:var(--color-brand-600)] sm:px-4"
      >
        <PlusIcon size={16} />
        <span className="hidden sm:inline">Add Candidate</span>
      </button>

      <div className="relative flex items-center gap-1" ref={notifRef}>
        <button
          type="button"
          id={notifId + "-button"}
          aria-label={`Notifications${
            unreadCount ? `, ${unreadCount} unread` : ""
          }`}
          aria-haspopup="menu"
          aria-expanded={notifOpen}
          aria-controls={notifId}
          onClick={() => setNotifOpen((o) => !o)}
          data-state={notifOpen ? "open" : "closed"}
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-[12px] text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)] data-[state=open]:bg-[color:var(--color-surface-2)] data-[state=open]:text-[color:var(--color-text)]"
        >
          <BellIcon />
          {unreadCount ? (
            <span className="absolute right-1 top-1 inline-flex min-w-[18px] justify-center rounded-full bg-[color:var(--color-error)] px-1 text-[10px] font-semibold leading-[18px] text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          ) : null}
        </button>

        {notifOpen ? (
          <div
            id={notifId}
            role="menu"
            aria-label="Notifications"
            className="absolute right-0 top-full z-50 mt-1.5 w-[min(92vw,380px)] overflow-hidden rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[0_10px_30px_rgba(15,16,20,0.12)]"
          >
            <div className="flex items-center justify-between gap-2 border-b border-[color:var(--color-border)] px-4 py-3">
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-[color:var(--color-text)]">
                  Notifications
                </p>
                <p className="text-[12px] text-[color:var(--color-text-secondary)]">
                  {unreadCount
                    ? `${unreadCount} unread`
                    : "You're all caught up"}
                </p>
              </div>
              <button
                type="button"
                onClick={markAllRead}
                disabled={unreadCount === 0}
                className="shrink-0 rounded-[8px] px-2 py-1 text-[12px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:bg-[color:var(--color-brand-50)] disabled:cursor-not-allowed disabled:text-[color:var(--color-text-muted)] disabled:hover:bg-transparent"
              >
                Mark all read
              </button>
            </div>

            <div
              role="tablist"
              aria-label="Notification filter"
              className="flex items-center gap-1 border-b border-[color:var(--color-border)] px-2 py-2"
            >
              {(["all", "unread"] as const).map((tab) => {
                const active = notifFilter === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setNotifFilter(tab)}
                    className={`rounded-[8px] px-2.5 py-1 text-[12px] font-semibold capitalize transition-colors ${
                      active
                        ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-text)]"
                        : "text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text)]"
                    }`}
                  >
                    {tab}
                    {tab === "unread" && unreadCount ? (
                      <span className="ml-1 rounded-full bg-[color:var(--color-brand-50)] px-1.5 text-[11px] font-semibold text-[color:var(--color-brand-600)]">
                        {unreadCount}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <ul className="max-h-[380px] overflow-y-auto py-1">
              {visibleNotifications.length === 0 ? (
                <li className="flex flex-col items-center gap-1 px-4 py-10 text-center">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--color-surface-2)] text-[color:var(--color-text-muted)]">
                    <BellIcon />
                  </span>
                  <p className="text-[13px] font-semibold text-[color:var(--color-text)]">
                    No notifications
                  </p>
                  <p className="text-[12px] text-[color:var(--color-text-secondary)]">
                    {notifFilter === "unread"
                      ? "You've read everything. Nice work."
                      : "New activity will show up here."}
                  </p>
                </li>
              ) : (
                visibleNotifications.map((n) => {
                  const content = (
                    <div className="flex items-start gap-3">
                      <NotificationIcon kind={n.kind} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-[color:var(--color-text)]">
                          {n.title}
                        </p>
                        <p className="line-clamp-2 text-[12px] text-[color:var(--color-text-secondary)]">
                          {n.description}
                        </p>
                        <p className="mt-1 text-[11px] text-[color:var(--color-text-muted)]">
                          {n.time}
                        </p>
                      </div>
                      {n.unread ? (
                        <span
                          aria-label="Unread"
                          className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[color:var(--color-brand-500)]"
                        />
                      ) : null}
                    </div>
                  );
                  const baseCls =
                    "block w-full rounded-[10px] px-3 py-2.5 text-left transition-colors outline-none hover:bg-[color:var(--color-surface-2)] focus:bg-[color:var(--color-surface-2)]";
                  return (
                    <li key={n.id} className="px-1">
                      {n.href ? (
                        <Link
                          href={n.href}
                          role="menuitem"
                          onClick={() => {
                            markOneRead(n.id);
                            closeNotif();
                          }}
                          className={baseCls}
                        >
                          {content}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => markOneRead(n.id)}
                          className={baseCls}
                        >
                          {content}
                        </button>
                      )}
                    </li>
                  );
                })
              )}
            </ul>

            <div className="border-t border-[color:var(--color-border)] px-2 py-1.5">
              <Link
                href="/settings"
                onClick={closeNotif}
                className="flex items-center justify-center rounded-[8px] px-3 py-2 text-[13px] font-semibold text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
              >
                Notification settings
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      <div className="relative sm:ml-1" ref={rootRef}>
        <button
          type="button"
          id={menuId + "-button"}
          aria-label={`${userName}, ${userRole}. Open profile menu`}
          aria-haspopup="menu"
          aria-expanded={profileMenuOpen}
          aria-controls={menuId}
          onClick={() => setProfileMenuOpen((o) => !o)}
          className="flex shrink-0 items-center gap-2.5 rounded-[12px] py-1 pl-1 pr-2 text-left transition-colors hover:bg-[color:var(--color-surface-2)] data-[state=open]:bg-[color:var(--color-surface-2)] sm:pr-3"
          data-state={profileMenuOpen ? "open" : "closed"}
        >
          <Avatar name={userName} size={36} />
          <div className="hidden min-w-0 text-left leading-tight sm:block">
            <p className="truncate text-[13px] font-semibold text-[color:var(--color-text)]">
              {userName}
            </p>
            <p className="truncate text-[11px] text-[color:var(--color-text-secondary)]">
              {userRole}
            </p>
          </div>
          <ChevronDown
            className={`hidden shrink-0 text-[color:var(--color-text-muted)] transition-transform duration-200 sm:block ${
              profileMenuOpen ? "rotate-180" : ""
            }`}
            size={16}
          />
        </button>

        {profileMenuOpen ? (
          <div
            id={menuId}
            role="menu"
            aria-label="Profile"
            className="absolute right-0 top-full z-50 mt-1.5 min-w-[220px] rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-1 shadow-[0_10px_30px_rgba(15,16,20,0.12)]"
          >
            <Link
              href="/settings"
              role="menuitem"
              onClick={closeProfileMenu}
              className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[13px] font-medium text-[color:var(--color-text)] transition-colors outline-none hover:bg-[color:var(--color-surface-2)] focus:bg-[color:var(--color-surface-2)]"
            >
              <SettingsIcon size={18} className="shrink-0 text-[color:var(--color-text-muted)]" />
              {"Account & settings"}
            </Link>
            <div
              className="my-1 h-px bg-[color:var(--color-border)]"
              role="separator"
            />
            <Link
              href="/login"
              role="menuitem"
              onClick={closeProfileMenu}
              className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[13px] font-medium text-[color:var(--color-text-secondary)] transition-colors outline-none hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-error)] focus:bg-[color:var(--color-surface-2)]"
            >
              Log out
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  );
}
