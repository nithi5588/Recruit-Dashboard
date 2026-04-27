"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  FilterIcon,
  InfoIcon,
  SearchIcon,
  SparklesIcon,
  XIcon,
} from "@/components/icons/AppIcons";
import { MatchCard } from "@/components/matches/match-card";
import {
  MatchFilterRail,
  initialFilters,
  SALARY_HARD_MIN,
  SALARY_HARD_MAX,
  type FilterState,
} from "@/components/matches/match-filter-rail";
import {
  allLocations,
  allRoles,
  matches as ALL_MATCHES,
  topSkills,
} from "@/lib/matches/mock-data";
import {
  scoreTone,
  type Seniority,
  type WorkMode,
} from "@/lib/matches/types";

type TabKey = "all" | "excellent" | "good" | "fair" | "saved";

const TABS: { key: TabKey; label: string; toneClass: string; underline: string }[] = [
  { key: "all",       label: "All",       toneClass: "bg-[color:var(--color-surface-2)] text-[color:var(--color-text)]",     underline: "bg-[color:var(--color-text)]" },
  { key: "excellent", label: "Excellent", toneClass: "bg-[color:var(--color-brand-100)] text-[color:var(--color-brand-700)]", underline: "bg-[color:var(--color-brand-500)]" },
  { key: "good",      label: "Good",      toneClass: "bg-[color:var(--color-brand-100)] text-[color:var(--color-brand-700)]",     underline: "bg-[color:var(--color-brand-400)]" },
  { key: "fair",      label: "Fair",      toneClass: "bg-[color:var(--color-surface-2)] text-[color:var(--color-text)]",     underline: "bg-[color:var(--color-text-muted)]" },
  { key: "saved",     label: "Saved",     toneClass: "bg-[color:var(--color-brand-100)] text-[color:var(--color-brand-700)]",   underline: "bg-[color:var(--color-brand-500)]" },
];

const PAGE_SIZE_OPTIONS = [12, 24, 48] as const;

// ─── URL helpers ──────────────────────────────────────────────────────────────

function csv(arr: string[]): string {
  return arr.join(",");
}

function fromCsv(s: string | null): string[] {
  return s ? s.split(",").filter(Boolean) : [];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MatchesPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── State derived from URL ──
  const tab = (searchParams.get("tab") as TabKey) || "all";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "12", 10);

  const filters: FilterState = useMemo(() => {
    const f = initialFilters();
    f.roles      = fromCsv(searchParams.get("roles"));
    f.seniority  = fromCsv(searchParams.get("seniority")) as Seniority[];
    f.locations  = fromCsv(searchParams.get("locations"));
    f.workModes  = fromCsv(searchParams.get("workModes")) as WorkMode[];
    f.skills     = fromCsv(searchParams.get("skills"));
    const sal = searchParams.get("salary");
    if (sal) {
      const [lo, hi] = sal.split("-").map((n) => parseInt(n, 10));
      if (Number.isFinite(lo)) f.salaryMin = lo;
      if (Number.isFinite(hi)) f.salaryMax = hi;
    }
    const score = searchParams.get("score");
    if (score) {
      const [lo, hi] = score.split("-").map((n) => parseInt(n, 10));
      if (Number.isFinite(lo)) f.scoreMin = lo;
      if (Number.isFinite(hi)) f.scoreMax = hi;
    }
    return f;
  }, [searchParams]);

  // Local state — not URL-synced
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(ALL_MATCHES.map((m) => [m.id, m.saved])),
  );
  const [focusIdx, setFocusIdx] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // ── URL writers ──
  const writeParams = useCallback(
    (changes: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(changes)) {
        if (v === null || v === "") params.delete(k);
        else params.set(k, v);
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const setTab = (t: TabKey) =>
    writeParams({ tab: t === "all" ? null : t, page: null });
  const setPage = (p: number) =>
    writeParams({ page: p === 1 ? null : String(p) });
  const setPageSize = (n: number) =>
    writeParams({ pageSize: n === 12 ? null : String(n), page: null });

  const setFilters = useCallback((next: FilterState) => {
    writeParams({
      roles:     next.roles.length      ? csv(next.roles)     : null,
      seniority: next.seniority.length  ? csv(next.seniority) : null,
      locations: next.locations.length  ? csv(next.locations) : null,
      workModes: next.workModes.length  ? csv(next.workModes) : null,
      skills:    next.skills.length     ? csv(next.skills)    : null,
      salary:    next.salaryMin === SALARY_HARD_MIN && next.salaryMax === SALARY_HARD_MAX
        ? null
        : `${next.salaryMin}-${next.salaryMax}`,
      score:     next.scoreMin === 0 && next.scoreMax === 100
        ? null
        : `${next.scoreMin}-${next.scoreMax}`,
      page: null,
    });
  }, [writeParams]);

  const clearAllFilters = useCallback(() => {
    writeParams({
      roles: null, seniority: null, locations: null, workModes: null,
      skills: null, salary: null, score: null, page: null,
    });
  }, [writeParams]);

  // ── Derived data ──
  const filteredByFilters = useMemo(() => {
    return ALL_MATCHES.filter((m) => {
      if (filters.roles.length && !filters.roles.includes(m.job.title)) return false;
      if (filters.seniority.length && !filters.seniority.includes(m.candidate.seniority)) return false;
      if (filters.locations.length && !filters.locations.includes(m.job.location)) return false;
      if (filters.workModes.length && !filters.workModes.includes(m.job.workMode)) return false;

      const overlapsSalary = m.job.salaryMin <= filters.salaryMax && m.job.salaryMax >= filters.salaryMin;
      if (!overlapsSalary) return false;

      if (filters.skills.length) {
        const all = [...m.matchedSkills, ...m.missingSkills];
        if (!filters.skills.every((s) => all.includes(s))) return false;
      }

      if (m.score < filters.scoreMin || m.score > filters.scoreMax) return false;
      return true;
    });
  }, [filters]);

  const counts = useMemo(() => {
    const c = { all: 0, excellent: 0, good: 0, fair: 0, saved: 0 };
    for (const m of filteredByFilters) {
      c.all++;
      const tone = scoreTone(m.score);
      if (tone === "excellent") c.excellent++;
      else if (tone === "good") c.good++;
      else c.fair++;
      if (bookmarks[m.id]) c.saved++;
    }
    return c;
  }, [filteredByFilters, bookmarks]);

  const filteredByTab = useMemo(() => {
    return filteredByFilters.filter((m) => {
      if (tab === "all") return true;
      if (tab === "saved") return bookmarks[m.id];
      const tone = scoreTone(m.score);
      return tone === tab;
    });
  }, [filteredByFilters, tab, bookmarks]);

  const totalPages = Math.max(1, Math.ceil(filteredByTab.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const visible = filteredByTab.slice(startIdx, startIdx + pageSize);

  // Reset focus index when results change — adjust-state-on-prop-change pattern
  // (React docs: https://react.dev/learn/you-might-not-need-an-effect)
  const resultsKey = `${tab}|${safePage}|${pageSize}|${JSON.stringify(filters)}`;
  const [seenKey, setSeenKey] = useState(resultsKey);
  if (seenKey !== resultsKey) {
    setSeenKey(resultsKey);
    setFocusIdx(0);
  }

  const activeCount =
    filters.roles.length +
    filters.seniority.length +
    filters.locations.length +
    filters.workModes.length +
    filters.skills.length +
    (filters.salaryMin !== SALARY_HARD_MIN || filters.salaryMax !== SALARY_HARD_MAX ? 1 : 0) +
    (filters.scoreMin !== 0 || filters.scoreMax !== 100 ? 1 : 0);

  // ── Keyboard shortcuts: J/K/B/E ──
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    function isTyping(e: KeyboardEvent): boolean {
      const t = e.target as HTMLElement | null;
      if (!t) return false;
      const tag = t.tagName.toLowerCase();
      return tag === "input" || tag === "textarea" || t.isContentEditable;
    }
    function onKey(e: KeyboardEvent) {
      if (isTyping(e)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (visible.length === 0) return;

      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        setFocusIdx((i) => {
          const next = Math.min(visible.length - 1, i + 1);
          cardRefs.current[next]?.focus();
          return next;
        });
      } else if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        setFocusIdx((i) => {
          const next = Math.max(0, i - 1);
          cardRefs.current[next]?.focus();
          return next;
        });
      } else if (e.key === "b" || e.key === "B") {
        e.preventDefault();
        const m = visible[focusIdx];
        if (m) setBookmarks((p) => ({ ...p, [m.id]: !p[m.id] }));
      } else if (e.key === "e" || e.key === "E") {
        e.preventDefault();
        const m = visible[focusIdx];
        if (m) console.log("introduce", m.id);
      } else if (e.key === "?") {
        e.preventDefault();
        setShowShortcuts((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, focusIdx]);

  // ── Active filter chips ──
  const chips = useMemo(() => {
    const c: Array<{ label: string; onRemove: () => void }> = [];
    filters.roles.forEach((r) =>
      c.push({ label: r, onRemove: () => setFilters({ ...filters, roles: filters.roles.filter((x) => x !== r) }) }),
    );
    filters.seniority.forEach((s) =>
      c.push({ label: s, onRemove: () => setFilters({ ...filters, seniority: filters.seniority.filter((x) => x !== s) }) }),
    );
    filters.locations.forEach((l) =>
      c.push({ label: l, onRemove: () => setFilters({ ...filters, locations: filters.locations.filter((x) => x !== l) }) }),
    );
    filters.workModes.forEach((w) =>
      c.push({ label: w, onRemove: () => setFilters({ ...filters, workModes: filters.workModes.filter((x) => x !== w) }) }),
    );
    filters.skills.forEach((s) =>
      c.push({ label: s, onRemove: () => setFilters({ ...filters, skills: filters.skills.filter((x) => x !== s) }) }),
    );
    if (filters.salaryMin !== SALARY_HARD_MIN || filters.salaryMax !== SALARY_HARD_MAX) {
      c.push({
        label: `Salary $${(filters.salaryMin / 1000).toFixed(0)}K – $${(filters.salaryMax / 1000).toFixed(0)}K`,
        onRemove: () => setFilters({ ...filters, salaryMin: SALARY_HARD_MIN, salaryMax: SALARY_HARD_MAX }),
      });
    }
    if (filters.scoreMin !== 0 || filters.scoreMax !== 100) {
      c.push({
        label: `Score ${filters.scoreMin}–${filters.scoreMax}`,
        onRemove: () => setFilters({ ...filters, scoreMin: 0, scoreMax: 100 }),
      });
    }
    return c;
  }, [filters, setFilters]);

  function toggleBookmark(id: string) {
    setBookmarks((p) => ({ ...p, [id]: !p[id] }));
  }

  return (
    <div className="min-h-full bg-[color:var(--color-bg-base)]">
      <div className="mx-auto flex w-full max-w-[1440px] gap-5 px-4 py-6 sm:px-6 xl:px-8 xl:py-8">
        {/* ═══ FILTER RAIL — desktop, as a floating card ════════════════════ */}
        <aside className="sticky top-[88px] hidden h-[calc(100vh-104px)] w-[260px] shrink-0 self-start overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-card)] lg:block">
          <MatchFilterRail
            filters={filters}
            onChange={setFilters}
            roles={allRoles}
            locations={allLocations}
            skills={topSkills}
            activeCount={activeCount}
            onClearAll={clearAllFilters}
          />
        </aside>

        {/* ═══ MAIN ═══════════════════════════════════════════════════════ */}
        <main className="min-w-0 flex-1">
          {/* Header */}
          <header className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-[22px] font-bold leading-[30px] tracking-tight text-[color:var(--color-text)] sm:text-[26px] sm:leading-[34px]">
                Matches
              </h1>
              <p className="mt-1 text-[13px] leading-[20px] text-[color:var(--color-text-secondary)] sm:text-[14px] sm:leading-[22px]">
                AI-ranked candidate–job pairings with explainable scoring across skills, location, seniority, and salary.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-sm font-medium text-[color:var(--color-text)] shadow-sm transition-colors hover:bg-[color:var(--color-bg-base)] lg:hidden"
              >
                <FilterIcon size={14} />
                Filters
                {activeCount > 0 && (
                  <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[color:var(--color-brand-500)] px-1.5 text-[10px] font-bold text-white">
                    {activeCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                className="inline-flex h-9 items-center gap-2 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-sm font-medium text-[color:var(--color-text)] shadow-sm transition-colors hover:bg-[color:var(--color-bg-base)]"
              >
                <DownloadIcon size={14} />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button
                type="button"
                className="inline-flex h-9 items-center gap-2 rounded-md bg-[color:var(--color-brand-500)] px-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[color:var(--color-brand-600)]"
              >
                <SparklesIcon size={14} />
                <span className="hidden sm:inline">Run New Match</span>
                <span className="sm:hidden">New</span>
              </button>
            </div>
          </header>

          {/* Tab strip */}
          <div className="mb-4 border-b border-[color:var(--color-border)]">
            <div className="flex gap-1 overflow-x-auto">
              {TABS.map((t) => {
                const active = tab === t.key;
                const count = counts[t.key];
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setTab(t.key)}
                    aria-current={active ? "page" : undefined}
                    className={`relative shrink-0 px-4 pb-3 pt-2 text-sm font-medium transition-colors ${
                      active ? "text-[color:var(--color-text)]" : "text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text)]"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      {t.label}
                      <span
                        className={`inline-flex h-5 min-w-[24px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold ${t.toneClass}`}
                      >
                        {count}
                      </span>
                    </span>
                    {active && (
                      <span
                        aria-hidden
                        className={`absolute bottom-0 left-2 right-2 h-[2px] rounded-t-full ${t.underline}`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active filter chips */}
          {chips.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {chips.map((c, i) => (
                <span
                  key={`${c.label}-${i}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] py-1 pl-3 pr-1 text-xs font-medium text-[color:var(--color-text)] shadow-sm"
                >
                  {c.label}
                  <button
                    type="button"
                    onClick={c.onRemove}
                    aria-label={`Remove filter: ${c.label}`}
                    className="flex h-5 w-5 items-center justify-center rounded-full text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
                  >
                    <XIcon size={11} />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={clearAllFilters}
                className="ml-auto text-xs font-semibold text-[color:var(--color-brand-600)] hover:text-[color:var(--color-brand-700)]"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results */}
          {visible.length === 0 ? (
            <EmptyState onClear={clearAllFilters} hasFilters={chips.length > 0 || tab !== "all"} />
          ) : (
            <div className="fx-stagger space-y-3">
              {visible.map((m, i) => (
                <MatchCard
                  key={m.id}
                  match={m}
                  saved={!!bookmarks[m.id]}
                  onToggleSave={() => toggleBookmark(m.id)}
                  onIntroduce={() => console.log("introduce", m.id)}
                  isFocused={focusIdx === i}
                  onFocus={() => setFocusIdx(i)}
                  registerRef={(el) => { cardRefs.current[i] = el; }}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {visible.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--color-border)] pt-4">
              <p className="text-sm text-[color:var(--color-text-secondary)]">
                Showing {startIdx + 1}–{Math.min(startIdx + pageSize, filteredByTab.length)} of {filteredByTab.length}
              </p>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs text-[color:var(--color-text-secondary)]">
                  Per page
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
                    className="h-8 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-2 pr-7 text-sm text-[color:var(--color-text)] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-500)]"
                  >
                    {PAGE_SIZE_OPTIONS.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </label>
                <Pagination total={totalPages} page={safePage} onChange={setPage} />
              </div>
            </div>
          )}

          {/* Shortcuts hint */}
          <div className="mt-6 flex items-center justify-end">
            <button
              type="button"
              onClick={() => setShowShortcuts((v) => !v)}
              aria-label="Show keyboard shortcuts"
              className="inline-flex items-center gap-1.5 text-xs text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)]"
            >
              <InfoIcon size={12} />
              Press <kbd className="rounded border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-1.5 py-0.5 font-mono text-[10px]">?</kbd> for shortcuts
            </button>
          </div>
          {showShortcuts && (
            <div className="fixed bottom-6 right-6 z-50 w-[280px] rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-xl">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-[color:var(--color-text)]">Keyboard shortcuts</p>
                <button
                  type="button"
                  onClick={() => setShowShortcuts(false)}
                  aria-label="Close shortcuts"
                  className="text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)]"
                >
                  <XIcon size={14} />
                </button>
              </div>
              <ul className="space-y-1.5 text-xs text-[color:var(--color-text-secondary)]">
                <li className="flex justify-between"><span>Next match</span><kbd className="rounded border border-[color:var(--color-border)] bg-[color:var(--color-bg-base)] px-1.5 py-0.5 font-mono text-[10px]">J</kbd></li>
                <li className="flex justify-between"><span>Previous match</span><kbd className="rounded border border-[color:var(--color-border)] bg-[color:var(--color-bg-base)] px-1.5 py-0.5 font-mono text-[10px]">K</kbd></li>
                <li className="flex justify-between"><span>Bookmark focused</span><kbd className="rounded border border-[color:var(--color-border)] bg-[color:var(--color-bg-base)] px-1.5 py-0.5 font-mono text-[10px]">B</kbd></li>
                <li className="flex justify-between"><span>Introduce focused</span><kbd className="rounded border border-[color:var(--color-border)] bg-[color:var(--color-bg-base)] px-1.5 py-0.5 font-mono text-[10px]">E</kbd></li>
              </ul>
            </div>
          )}
        </main>
      </div>

      {/* ═══ MOBILE FILTER SHEET ════════════════════════════════════════════ */}
      {mobileFiltersOpen && (
        <>
          <div
            aria-hidden
            onClick={() => setMobileFiltersOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          />
          <div className="fixed inset-y-0 left-0 z-50 w-[88vw] max-w-[320px] bg-[color:var(--color-surface)] shadow-xl lg:hidden">
            <div className="flex items-center justify-between border-b border-[color:var(--color-border)] px-4 py-3">
              <p className="text-sm font-semibold text-[color:var(--color-text)]">Filters</p>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="flex h-8 w-8 items-center justify-center rounded-md text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
              >
                <XIcon size={14} />
              </button>
            </div>
            <div className="h-[calc(100%-49px)] overflow-y-auto">
              <MatchFilterRail
                filters={filters}
                onChange={setFilters}
                roles={allRoles}
                locations={allLocations}
                skills={topSkills}
                activeCount={activeCount}
                onClearAll={clearAllFilters}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ hasFilters, onClear }: { hasFilters: boolean; onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--color-surface-2)]">
        <SearchIcon size={26} className="text-[color:var(--color-text-muted)]" />
        <span aria-hidden className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[color:var(--color-border)] text-[color:var(--color-text-muted)]">
          <XIcon size={11} />
        </span>
      </div>
      <p className="text-base font-semibold text-[color:var(--color-text)]">No matches fit these filters</p>
      <p className="mt-1 max-w-sm text-sm text-[color:var(--color-text-secondary)]">Try widening your criteria — drop a filter or two and rerun.</p>
      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-[color:var(--color-brand-500)] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[color:var(--color-brand-600)]"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({
  total,
  page,
  onChange,
}: {
  total: number;
  page: number;
  onChange: (p: number) => void;
}) {
  function range(): (number | "…")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const items: (number | "…")[] = [1];
    if (page > 3) items.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(total - 1, page + 1); i++) {
      items.push(i);
    }
    if (page < total - 2) items.push("…");
    items.push(total);
    return items;
  }

  return (
    <nav aria-label="Pagination" className="flex items-center gap-1">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[color:var(--color-border)] disabled:hover:text-[color:var(--color-text-secondary)]"
      >
        <ChevronLeft size={14} />
      </button>
      {range().map((n, i) =>
        n === "…" ? (
          <span key={`ell-${i}`} className="px-1 text-[color:var(--color-text-muted)]">…</span>
        ) : (
          <button
            key={n}
            type="button"
            aria-current={n === page ? "page" : undefined}
            onClick={() => onChange(n)}
            className={`flex h-8 min-w-[32px] items-center justify-center rounded-md px-2 text-xs font-semibold transition-colors ${
              n === page
                ? "bg-[color:var(--color-brand-500)] text-white shadow-sm"
                : "border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)]"
            }`}
          >
            {n}
          </button>
        ),
      )}
      <button
        type="button"
        aria-label="Next page"
        disabled={page === total}
        onClick={() => onChange(page + 1)}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[color:var(--color-border)] disabled:hover:text-[color:var(--color-text-secondary)]"
      >
        <ChevronRight size={14} />
      </button>
    </nav>
  );
}
