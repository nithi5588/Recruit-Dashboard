"use client";

import { useMemo, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import {
  BookmarkIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FilterIcon,
  MatchIcon,
  SearchIcon,
  SortIcon,
  SparklesIcon,
  UsersIcon,
  VerifiedBadgeIcon,
} from "@/components/icons/AppIcons";
import {
  type Match,
  type MatchQuality,
  allMatches,
  matchStats,
} from "@/lib/matches-data";

// ─── Quality theme ────────────────────────────────────────────────────────────

const QUALITY_COLOR: Record<MatchQuality, string> = {
  Excellent: "#22C55E",
  Good:      "#3B82F6",
  Fair:      "#F59E0B",
  Low:       "#EF4444",
};

// Soft background tints used for chips / score ring background
const QUALITY_BG: Record<MatchQuality, string> = {
  Excellent: "#EAFBF1",
  Good:      "#EAF2FF",
  Fair:      "#FFF4DB",
  Low:       "#FDECEC",
};

const QUALITY_LABEL: Record<MatchQuality, string> = {
  Excellent: "Excellent Match",
  Good:      "Good Match",
  Fair:      "Fair Match",
  Low:       "Low Match",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function deriveQuality(score: number): MatchQuality {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 55) return "Fair";
  return "Low";
}

// Stable pseudo-random fallback (so SSR / re-renders stay consistent)
function hashedApplicants(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return 18 + (h % 50); // 18 – 67
}

const WORK_MODES: Array<"Hybrid" | "Remote" | "On-site"> = ["Hybrid", "Remote", "On-site"];
function deriveWorkMode(id: string): "Hybrid" | "Remote" | "On-site" {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return WORK_MODES[h % WORK_MODES.length];
}

// ─── Score ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score, quality }: { score: number; quality: MatchQuality }) {
  const size = 48;
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = QUALITY_COLOR[quality];

  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Match score ${score}%`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#EDEFF5"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-extrabold tracking-tight"
        style={{ color, fontSize: 12 }}
      >
        {score}
      </span>
    </span>
  );
}

// ─── Skill chip ───────────────────────────────────────────────────────────────

function SkillChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-[6px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-2 py-0.5 text-[11px] font-medium text-[color:var(--color-text-secondary)]">
      {label}
    </span>
  );
}

// ─── Company logo (job side) ──────────────────────────────────────────────────

function CompanyTile({ color, text }: { color: string; text: string }) {
  return (
    <span
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-[12px] font-bold tracking-tight text-white"
      style={{ background: color }}
      aria-hidden
    >
      {text}
    </span>
  );
}

// ─── Match Card ───────────────────────────────────────────────────────────────

function MatchCard({
  match,
  saved,
  onToggleSaved,
}: {
  match: Match;
  saved: boolean;
  onToggleSaved: () => void;
}) {
  const quality = deriveQuality(match.score);
  const qColor = QUALITY_COLOR[quality];
  const qBg = QUALITY_BG[quality];

  const workMode = match.job.workMode ?? deriveWorkMode(match.job.id);
  const applicants = match.job.applicants ?? hashedApplicants(match.job.id);

  const candidateSkills = match.candidate.skills.slice(0, 3);
  const extraCount = match.candidate.skills.length + match.candidate.extraSkills - candidateSkills.length;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] transition-all hover:border-[color:var(--color-brand-300)] hover:shadow-[var(--shadow-card)]">
      {/* ── Candidate panel ── */}
      <div className="flex flex-col gap-2 px-4 pb-3 pt-3.5">
        {/* Header row: avatar + ring + name + bookmark */}
        <div className="flex items-center gap-2.5">
          <div className="relative shrink-0">
            <Avatar name={match.candidate.name} size={40} />
            {match.candidate.isOnline ? (
              <span
                aria-label="Online"
                className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[color:var(--color-surface)] bg-[color:var(--color-success)]"
              />
            ) : null}
          </div>
          <ScoreRing score={match.score} quality={quality} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <h3 className="truncate text-[14px] font-bold text-[color:var(--color-text)]">
                {match.candidate.name}
              </h3>
              {match.candidate.isVerified ? (
                <VerifiedBadgeIcon
                  size={13}
                  className="shrink-0 text-[color:var(--color-brand-500)]"
                />
              ) : null}
            </div>
            <p className="truncate text-[12px] text-[color:var(--color-text-secondary)]">
              {match.candidate.role}
            </p>
          </div>
          <button
            type="button"
            onClick={onToggleSaved}
            aria-pressed={saved}
            aria-label={saved ? "Remove from saved" : "Save match"}
            className={`-mr-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] transition-colors ${
              saved
                ? "bg-[color:var(--color-brand-50)] text-[color:var(--color-brand-600)]"
                : "text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-secondary)]"
            }`}
          >
            <BookmarkIcon size={14} />
          </button>
        </div>

        {/* Quality + meta row */}
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] text-[color:var(--color-text-muted)]">
          <span
            className="inline-flex items-center gap-1 rounded-[6px] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
            style={{ color: qColor, background: qBg }}
          >
            <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: qColor }} />
            {QUALITY_LABEL[quality]}
          </span>
          <span className="text-[color:var(--color-border-strong)]">·</span>
          <span className="truncate">
            {match.candidate.location} · {match.candidate.experience} exp
          </span>
        </div>

        {/* Skills */}
        <ul className="flex flex-wrap gap-1">
          {candidateSkills.map((s) => (
            <li key={s}>
              <SkillChip label={s} />
            </li>
          ))}
          {extraCount > 0 ? (
            <li>
              <SkillChip label={`+${extraCount}`} />
            </li>
          ) : null}
        </ul>
      </div>

      {/* ── Job panel ── */}
      <div className="mt-auto flex flex-col gap-2.5 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/40 px-4 pb-3.5 pt-3">
        <div className="flex items-start gap-2.5">
          <CompanyTile color={match.job.logoColor} text={match.job.logoText} />
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-[13px] font-bold text-[color:var(--color-text)]">
              {match.job.title}
            </h4>
            <p className="truncate text-[11px] text-[color:var(--color-text-secondary)]">
              {match.job.company} · {match.job.location}
            </p>
            <p className="mt-1 text-[12px] font-bold text-[color:var(--color-text)]">
              {match.job.salary}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-[color:var(--color-text-muted)]">
          <span className="inline-flex items-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-2 py-0.5 text-[10px] font-semibold text-[color:var(--color-text-secondary)]">
            {match.job.type}
          </span>
          <span className="inline-flex items-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-2 py-0.5 text-[10px] font-semibold text-[color:var(--color-text-secondary)]">
            {workMode}
          </span>
          <span className="ml-auto truncate">
            {match.job.postedAgo} · {applicants} applicants
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="inline-flex h-8 flex-1 items-center justify-center rounded-[8px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-2 text-[11px] font-semibold text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)]"
          >
            View Profile
          </button>
          <button
            type="button"
            className="inline-flex h-8 flex-1 items-center justify-center rounded-[8px] bg-[color:var(--color-brand-500)] px-2 text-[11px] font-semibold text-white shadow-[0_4px_10px_rgba(91,61,245,0.28)] transition-colors hover:bg-[color:var(--color-brand-600)]"
          >
            View Job
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type TabKey = "all" | "excellent" | "good" | "fair" | "saved";

const TABS: {
  key: TabKey;
  label: string;
  count: number;
  color?: string;
  icon?: "match" | "bookmark";
}[] = [
  { key: "all",       label: "All Matches", count: matchStats.total,     icon: "match" },
  { key: "excellent", label: "Excellent",   count: matchStats.excellent, color: QUALITY_COLOR.Excellent },
  { key: "good",      label: "Good",        count: matchStats.good,      color: QUALITY_COLOR.Good },
  { key: "fair",      label: "Fair",        count: matchStats.fair,      color: QUALITY_COLOR.Fair },
  { key: "saved",     label: "Saved",       count: matchStats.saved ?? 0, icon: "bookmark" },
];

function Tabs({ active, onChange }: { active: TabKey; onChange: (k: TabKey) => void }) {
  return (
    <div role="tablist" aria-label="Match filters" className="flex flex-wrap items-center gap-2">
      {TABS.map((t) => {
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(t.key)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-[999px] border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
              isActive
                ? "border-[color:var(--color-brand-200)] bg-[color:var(--color-brand-50)] text-[color:var(--color-brand-600)]"
                : "border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-secondary)] hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)]"
            }`}
          >
            {t.icon === "match" ? (
              <MatchIcon size={13} className={isActive ? "text-[color:var(--color-brand-500)]" : ""} />
            ) : t.icon === "bookmark" ? (
              <BookmarkIcon size={13} className={isActive ? "text-[color:var(--color-brand-500)]" : ""} />
            ) : t.color ? (
              <span
                aria-hidden
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: t.color }}
              />
            ) : null}
            {t.label}
            <span
              className={`inline-flex h-5 min-w-[22px] items-center justify-center rounded-[6px] px-1.5 text-[11px] font-bold ${
                isActive
                  ? "bg-[color:var(--color-brand-100)] text-[color:var(--color-brand-700)]"
                  : "bg-[color:var(--color-surface-2)] text-[color:var(--color-text-secondary)]"
              }`}
            >
              {t.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const SORT_OPTIONS = ["Best Match", "Newest", "Highest Score", "Alphabetical"];
const PER_PAGE_OPTIONS = [9, 12, 18, 24];

export function MatchesPageClient() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Best Match");
  const [sortOpen, setSortOpen] = useState(false);
  const [perPage, setPerPage] = useState(12);
  const [perPageOpen, setPerPageOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [savedIds, setSavedIds] = useState<Set<string>>(
    () => new Set(allMatches.filter((m) => m.saved).map((m) => m.id)),
  );

  function toggleSaved(id: string) {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allMatches
      .filter((m) => {
        if (q) {
          const hay = [
            m.candidate.name,
            m.candidate.role,
            m.job.title,
            m.job.company,
            m.candidate.skills.join(" "),
          ]
            .join(" ")
            .toLowerCase();
          if (!hay.includes(q)) return false;
        }
        const quality = deriveQuality(m.score);
        if (activeTab === "excellent" && quality !== "Excellent") return false;
        if (activeTab === "good" && quality !== "Good") return false;
        if (activeTab === "fair" && quality !== "Fair") return false;
        if (activeTab === "saved" && !savedIds.has(m.id)) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "Highest Score") return b.score - a.score;
        if (sortBy === "Alphabetical")
          return a.candidate.name.localeCompare(b.candidate.name);
        if (sortBy === "Newest") {
          // simple recency by job postedAgo
          const r = (s: string) => {
            const m = s.match(/(\d+)\s*(day|week|month)/);
            if (!m) return 999;
            const n = parseInt(m[1], 10);
            const unit = m[2];
            if (unit.startsWith("week")) return n * 7;
            if (unit.startsWith("month")) return n * 30;
            return n;
          };
          return r(a.job.postedAgo) - r(b.job.postedAgo);
        }
        return b.score - a.score; // Best Match (default)
      });
  }, [searchQuery, activeTab, sortBy, savedIds]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

  function handleTabChange(k: TabKey) {
    setActiveTab(k);
    setPage(1);
  }

  return (
    <div className="min-h-full space-y-4 px-4 py-5 sm:space-y-5 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
      {/* Header */}
      <header className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-[22px] font-bold leading-[28px] tracking-tight text-[color:var(--color-text)] sm:text-[28px] sm:leading-[34px]">
              Matches
            </h1>
            <SparklesIcon size={18} className="text-[color:var(--color-brand-500)]" />
          </div>
          <p className="mt-1 text-[13px] text-[color:var(--color-text-secondary)] sm:text-[14px]">
            AI-powered matches between your candidates and active job postings.
          </p>
        </div>
      </header>

      {/* Tabs + toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs active={activeTab} onChange={handleTabChange} />

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[12px] font-medium text-[color:var(--color-text)] shadow-[var(--shadow-card)] transition-colors hover:border-[color:var(--color-brand-300)] hover:bg-[color:var(--color-brand-50)]"
          >
            <CalendarIcon size={13} className="text-[color:var(--color-brand-500)]" />
            <span className="hidden sm:inline">May 12 – May 18, 2024</span>
            <span className="sm:hidden">May 12–18</span>
            <ChevronDown size={12} className="text-[color:var(--color-text-muted)]" />
          </button>

          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[12px] font-medium text-[color:var(--color-text-secondary)] shadow-[var(--shadow-card)] transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)]"
          >
            <FilterIcon size={13} />
            <span>Filters</span>
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setSortOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={sortOpen}
              className="inline-flex h-9 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[12px] font-medium text-[color:var(--color-text-secondary)] shadow-[var(--shadow-card)] transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)]"
            >
              <SortIcon size={13} />
              <span>Sort: {sortBy}</span>
              <ChevronDown
                size={12}
                className={`text-[color:var(--color-text-muted)] transition-transform ${
                  sortOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {sortOpen ? (
              <div
                role="menu"
                className="absolute right-0 top-full z-30 mt-1.5 w-[180px] overflow-hidden rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-dropdown)]"
              >
                {SORT_OPTIONS.map((opt) => {
                  const isActive = sortBy === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setSortBy(opt);
                        setSortOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-3 py-2 text-left text-[12px] transition-colors hover:bg-[color:var(--color-surface-2)] ${
                        isActive
                          ? "font-semibold text-[color:var(--color-brand-600)]"
                          : "text-[color:var(--color-text)]"
                      }`}
                    >
                      {opt}
                      {isActive ? <CheckIcon size={12} /> : null}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--color-text-muted)]">
          <SearchIcon size={15} />
        </span>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search by candidate name, skills, or job title…"
          className="h-11 w-full rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] pl-10 pr-3 text-[13.5px] text-[color:var(--color-text)] placeholder:text-[color:var(--color-text-muted)] outline-none transition focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)]"
          aria-label="Search matches"
        />
      </div>

      {/* Match grid */}
      {pageItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3" role="list" aria-label="Match results">
          {pageItems.map((m) => (
            <div key={m.id} role="listitem" className="h-full">
              <MatchCard
                match={m}
                saved={savedIds.has(m.id)}
                onToggleSaved={() => toggleSaved(m.id)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[16px] border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-surface)] py-14 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-brand-100)]">
            <UsersIcon size={22} className="text-[color:var(--color-brand-500)]" />
          </div>
          <p className="text-[15px] font-semibold text-[color:var(--color-text)]">
            No matches found
          </p>
          <p className="mt-1 max-w-sm text-[13px] text-[color:var(--color-text-secondary)]">
            Try a different tab or broaden your search.
          </p>
        </div>
      )}

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              aria-label="Previous page"
              className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-secondary)] transition-colors enabled:hover:border-[color:var(--color-border-strong)] enabled:hover:text-[color:var(--color-text)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={14} />
            </button>
            {paginationItems(safePage, totalPages).map((p, i) =>
              p === "..." ? (
                <span
                  key={`e-${i}`}
                  className="px-1 text-[12px] text-[color:var(--color-text-muted)]"
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p as number)}
                  aria-current={safePage === p ? "page" : undefined}
                  className={`inline-flex h-9 min-w-[36px] items-center justify-center rounded-[8px] px-2 text-[12px] font-semibold transition-colors ${
                    safePage === p
                      ? "bg-[color:var(--color-brand-500)] text-white shadow-[0_4px_10px_rgba(91,61,245,0.28)]"
                      : "border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-secondary)] hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)]"
                  }`}
                >
                  {p}
                </button>
              ),
            )}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              aria-label="Next page"
              className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-secondary)] transition-colors enabled:hover:border-[color:var(--color-border-strong)] enabled:hover:text-[color:var(--color-text)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="flex items-center gap-2 text-[12px] text-[color:var(--color-text-secondary)]">
            <span>Show</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setPerPageOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={perPageOpen}
                className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-2.5 text-[12px] font-semibold text-[color:var(--color-text)] hover:border-[color:var(--color-border-strong)]"
              >
                {perPage}
                <ChevronDown
                  size={12}
                  className={`text-[color:var(--color-text-muted)] transition-transform ${
                    perPageOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {perPageOpen ? (
                <div className="absolute bottom-full right-0 z-30 mb-1.5 w-[100px] overflow-hidden rounded-[8px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-dropdown)]">
                  {PER_PAGE_OPTIONS.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => {
                        setPerPage(n);
                        setPage(1);
                        setPerPageOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-[12px] transition-colors hover:bg-[color:var(--color-surface-2)] ${
                        n === perPage
                          ? "font-semibold text-[color:var(--color-brand-600)]"
                          : "text-[color:var(--color-text)]"
                      }`}
                    >
                      {n}
                      {n === perPage ? <CheckIcon size={12} /> : null}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <span>per page</span>
          </div>
        </div>
      )}

      {/* Close pop-overs on outside click */}
      {(sortOpen || perPageOpen) && (
        <div
          aria-hidden
          className="fixed inset-0 z-10"
          onClick={() => {
            setSortOpen(false);
            setPerPageOpen(false);
          }}
        />
      )}
    </div>
  );
}

// ─── Pagination helper ────────────────────────────────────────────────────────

function paginationItems(current: number, total: number): Array<number | "..."> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: Array<number | "..."> = [];
  const add = (n: number | "...") => out.push(n);
  add(1);
  if (current > 3) add("...");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) add(i);
  if (current < total - 2) add("...");
  add(total);
  return out;
}

