"use client";

import { useMemo, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import {
  BookmarkIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDown,
  DownloadIcon,
  ExternalLinkIcon,
  FilterIcon,
  MoreIcon,
  PaperPlaneIcon,
  PinIcon,
  SearchIcon,
  SortIcon,
  SparklesIcon,
  VerifiedBadgeIcon,
  XIcon,
} from "@/components/icons/AppIcons";
import { exportToExcel } from "@/lib/export-utils";
import {
  type Match,
  type MatchQuality,
  matchStats,
  allMatches,
} from "@/lib/matches-data";

const PAGE_SIZE = 5;

const QUALITY_COLOR: Record<MatchQuality, string> = {
  Excellent: "#22C55E",
  Good: "#3B82F6",
  Fair: "#F59E0B",
};

const QUALITY_BG: Record<MatchQuality, string> = {
  Excellent: "#EAFBF1",
  Good: "#EAF2FF",
  Fair: "#FFF4DB",
};

// ─────────────────────────────────────────────────────────────────────────────
// Score ring
// ─────────────────────────────────────────────────────────────────────────────
function MatchScoreRing({
  score,
  quality,
  size = 72,
}: {
  score: number;
  quality: MatchQuality;
  size?: number;
}) {
  const stroke = size >= 72 ? 6 : 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = QUALITY_COLOR[quality];
  const numberSize = size >= 72 ? 18 : 14;

  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Match score ${score}%`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <defs>
          <linearGradient id={`ring-grad-${quality}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.6" />
          </linearGradient>
        </defs>
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
          stroke={`url(#ring-grad-${quality})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center"
        style={{ color }}
      >
        <span className="font-bold leading-none" style={{ fontSize: numberSize }}>
          {score}
          <span className="text-[10px] font-semibold">%</span>
        </span>
      </span>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero with distribution bar
// ─────────────────────────────────────────────────────────────────────────────
function MatchesHero({
  activeTab,
  onQualitySelect,
}: {
  activeTab: TabKey;
  onQualitySelect: (key: TabKey) => void;
}) {
  const items = [
    { key: "excellent" as TabKey, value: matchStats.excellent, label: "Excellent", color: QUALITY_COLOR.Excellent },
    { key: "good" as TabKey, value: matchStats.good, label: "Good", color: QUALITY_COLOR.Good },
    { key: "fair" as TabKey, value: matchStats.fair, label: "Fair", color: QUALITY_COLOR.Fair },
  ];
  const total = items.reduce((sum, it) => sum + it.value, 0) || 1;

  return (
    <section
      aria-label="Match overview"
      className="relative overflow-hidden rounded-[16px] border border-[color:var(--color-brand-200)] px-4 py-3.5 sm:px-5 sm:py-4"
      style={{
        background:
          "radial-gradient(900px 200px at 0% 0%, rgba(91,61,245,0.08), transparent 60%), linear-gradient(180deg, #FBFAFF 0%, #FFFFFF 100%)",
      }}
    >
      <div className="relative flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div className="flex items-center gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[color:var(--color-brand-500)] text-white shadow-[0_4px_12px_rgba(91,61,245,0.35)]"
            aria-hidden
          >
            <SparklesIcon size={16} />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="text-[22px] font-bold leading-none tracking-tight text-[color:var(--color-text)] sm:text-[24px]">
                {matchStats.total}
              </span>
              <span className="text-[13px] font-semibold text-[color:var(--color-text-secondary)]">
                smart matches
              </span>
              <span className="text-[11px] text-[color:var(--color-text-muted)]">
                · {matchStats.viewed} viewed this week
              </span>
            </div>
            <p className="mt-0.5 text-[12px] leading-[16px] text-[color:var(--color-text-secondary)]">
              AI pairings based on skills, experience &amp; preferences.
            </p>
          </div>
        </div>

        {/* Distribution bar */}
        <div className="w-full lg:max-w-[420px]">
          <div
            className="flex h-2 w-full overflow-hidden rounded-full bg-[color:var(--color-surface-2)]"
            role="group"
            aria-label="Click a segment to filter"
          >
            {items.map((it) => {
              const pct = (it.value / total) * 100;
              const active = activeTab === it.key || activeTab === "all";
              return (
                <button
                  key={it.key}
                  type="button"
                  onClick={() => onQualitySelect(it.key)}
                  aria-label={`Filter by ${it.label} (${it.value})`}
                  className="h-full transition-opacity hover:opacity-90"
                  style={{
                    width: `${pct}%`,
                    background: it.color,
                    opacity: active ? 1 : 0.35,
                  }}
                />
              );
            })}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5">
            {items.map((it) => (
              <button
                key={it.key}
                type="button"
                onClick={() => onQualitySelect(it.key)}
                className="group inline-flex items-baseline gap-1 text-left"
                aria-label={`Filter by ${it.label}`}
              >
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full"
                  style={{ background: it.color }}
                />
                <span className="text-[12px] font-bold text-[color:var(--color-text)]">
                  {it.value}
                </span>
                <span className="text-[11px] text-[color:var(--color-text-secondary)] group-hover:text-[color:var(--color-text)]">
                  {it.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab pill chips
// ─────────────────────────────────────────────────────────────────────────────
type TabKey = "all" | "excellent" | "good" | "fair" | "saved";

const TABS: {
  key: TabKey;
  label: string;
  count: number | null;
  color?: string;
}[] = [
  { key: "all", label: "All", count: matchStats.total },
  { key: "excellent", label: "Excellent", count: matchStats.excellent, color: QUALITY_COLOR.Excellent },
  { key: "good", label: "Good", count: matchStats.good, color: QUALITY_COLOR.Good },
  { key: "fair", label: "Fair", count: matchStats.fair, color: QUALITY_COLOR.Fair },
  { key: "saved", label: "Saved", count: 12 },
];

function MatchTabs({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (key: TabKey) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Match filters"
      className="flex items-center gap-2 overflow-x-auto pb-1"
    >
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        const isSaved = tab.key === "saved";
        return (
          <button
            key={tab.key}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-[999px] border px-3.5 py-2 text-[13px] font-semibold transition-all ${
              isActive
                ? "border-transparent bg-[color:var(--color-text)] text-white shadow-[var(--shadow-card)]"
                : "border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-secondary)] hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)]"
            }`}
          >
            {isSaved ? (
              <BookmarkIcon size={13} />
            ) : tab.color ? (
              <span
                aria-hidden
                className="inline-block h-2 w-2 rounded-full"
                style={{
                  background: tab.color,
                  boxShadow: isActive
                    ? `0 0 0 3px ${tab.color}33`
                    : undefined,
                }}
              />
            ) : (
              <span
                aria-hidden
                className={`inline-block h-2 w-2 rounded-full ${
                  isActive ? "bg-white" : "bg-[color:var(--color-text-muted)]"
                }`}
              />
            )}
            {tab.label}
            {tab.count !== null ? (
              <span
                className={`rounded-[999px] px-1.5 py-0.5 text-[11px] font-bold ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "bg-[color:var(--color-surface-2)] text-[color:var(--color-text-secondary)]"
                }`}
              >
                {tab.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Skill chips with overlap highlighting
// ─────────────────────────────────────────────────────────────────────────────
function MatchedSkillChip({
  label,
  matched,
}: {
  label: string;
  matched: boolean;
}) {
  if (matched) {
    return (
      <span className="inline-flex items-center gap-1 rounded-[999px] border border-[#BBF7D0] bg-[#F0FDF4] px-2 py-0.5 text-[11px] font-semibold text-[#166534]">
        <CheckIcon size={10} />
        {label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-[999px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-2 py-0.5 text-[11px] font-medium text-[color:var(--color-text-secondary)]">
      {label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Company logo (job side)
// ─────────────────────────────────────────────────────────────────────────────
function CompanyLogo({ color, text }: { color: string; text: string }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-[10px] font-bold text-white"
      style={{
        width: 40,
        height: 40,
        background: color,
        fontSize: 14,
        letterSpacing: "-0.02em",
      }}
      aria-hidden
    >
      {text}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Match card — the hero visual of this page
// ─────────────────────────────────────────────────────────────────────────────
function MatchCard({ match }: { match: Match }) {
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(match.saved);

  const qualityColor = QUALITY_COLOR[match.quality];
  const qualityBg = QUALITY_BG[match.quality];

  const normJobSkills = useMemo(
    () => new Set(match.job.skills.map((s) => s.toLowerCase())),
    [match.job.skills],
  );
  const overlapCount = match.candidate.skills.filter((s) =>
    normJobSkills.has(s.toLowerCase()),
  ).length;
  const totalJobSkills = match.job.skills.length;

  return (
    <article className="group relative overflow-hidden rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] transition-all hover:border-[color:var(--color-brand-300)] hover:shadow-[var(--shadow-card)]">
      {/* Top quality accent strip */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, ${qualityColor} 0%, ${qualityColor}55 100%)`,
        }}
      />

      {/* Header: quality + actions (all on one line with body of card) */}
      <div className="flex items-center justify-between gap-2 px-4 pt-3 sm:px-5">
        <div className="flex items-center gap-2 text-[11px]">
          <span
            className="inline-flex items-center gap-1 rounded-[999px] px-2 py-0.5 font-bold uppercase tracking-wide"
            style={{ color: qualityColor, background: qualityBg }}
          >
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: qualityColor }}
            />
            {match.quality}
          </span>
          <span className="font-semibold text-[color:var(--color-text-muted)]">
            {overlapCount}/{totalJobSkills} skills · posted {match.job.postedAgo}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => setSaved((s) => !s)}
            aria-pressed={saved}
            aria-label={saved ? "Remove from saved" : "Save match"}
            className={`inline-flex h-7 w-7 items-center justify-center rounded-[6px] transition-colors ${
              saved
                ? "bg-[color:var(--color-brand-50)] text-[color:var(--color-brand-600)]"
                : "text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-secondary)]"
            }`}
          >
            <BookmarkIcon size={14} />
          </button>
          <button
            type="button"
            aria-label="More options"
            className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-secondary)]"
          >
            <MoreIcon size={14} />
          </button>
        </div>
      </div>

      {/* Body: Candidate  ⚡  Job  (single row on md+, stacked on mobile) */}
      <div className="grid grid-cols-1 items-center gap-2 px-4 pb-3 pt-2 sm:px-5 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-3">
        {/* Candidate */}
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="relative shrink-0">
            <Avatar name={match.candidate.name} size={38} />
            {match.candidate.isOnline && (
              <span
                className="absolute bottom-0 right-0 block h-2 w-2 rounded-full border-2 border-white bg-[color:var(--color-success)]"
                aria-label="Online"
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="truncate text-[13px] font-semibold text-[color:var(--color-text)]">
                {match.candidate.name}
              </span>
              {match.candidate.isVerified && (
                <VerifiedBadgeIcon
                  size={12}
                  className="shrink-0 text-[color:var(--color-brand-500)]"
                />
              )}
            </div>
            <div className="truncate text-[11px] text-[color:var(--color-text-secondary)]">
              {match.candidate.role} · {match.candidate.location} ·{" "}
              {match.candidate.experience}
            </div>
            <ul className="mt-1 flex flex-wrap gap-1">
              {match.candidate.skills.slice(0, 3).map((s) => (
                <li key={s}>
                  <MatchedSkillChip
                    label={s}
                    matched={normJobSkills.has(s.toLowerCase())}
                  />
                </li>
              ))}
              {match.candidate.skills.length + match.candidate.extraSkills > 3 ? (
                <li>
                  <MatchedSkillChip
                    label={`+${match.candidate.skills.length + match.candidate.extraSkills - 3}`}
                    matched={false}
                  />
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        {/* Bridge — score ring */}
        <div className="flex items-center justify-center py-1 md:py-0">
          <span
            aria-hidden
            className="hidden h-px w-4 bg-gradient-to-r from-transparent to-[color:var(--color-border-strong)] md:block"
          />
          <MatchScoreRing
            score={match.score}
            quality={match.quality}
            size={64}
          />
          <span
            aria-hidden
            className="hidden h-px w-4 bg-gradient-to-l from-transparent to-[color:var(--color-border-strong)] md:block"
          />
        </div>

        {/* Job */}
        <div className="flex min-w-0 items-center gap-2.5">
          <CompanyLogo
            color={match.job.logoColor}
            text={match.job.logoText}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="truncate text-[13px] font-semibold text-[color:var(--color-text)]">
                {match.job.title}
              </span>
              {match.job.isVerified && (
                <VerifiedBadgeIcon
                  size={12}
                  className="shrink-0 text-[color:var(--color-brand-500)]"
                />
              )}
            </div>
            <div className="truncate text-[11px] text-[color:var(--color-text-secondary)]">
              {match.job.company} · {match.job.location} ·{" "}
              <span className="font-semibold text-[color:var(--color-text)]">
                {match.job.salary}
              </span>
            </div>
            <ul className="mt-1 flex flex-wrap gap-1">
              {match.job.skills.slice(0, 3).map((s) => (
                <li key={s}>
                  <MatchedSkillChip label={s} matched />
                </li>
              ))}
              {match.job.skills.length + match.job.extraSkills > 3 ? (
                <li>
                  <MatchedSkillChip
                    label={`+${match.job.skills.length + match.job.extraSkills - 3}`}
                    matched={false}
                  />
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer: why-toggle + actions (compact, single row) */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/50 px-4 py-2 sm:px-5">
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-text)]"
        >
          <SparklesIcon
            size={12}
            className="text-[color:var(--color-brand-500)]"
          />
          Why this match
          <span className="text-[color:var(--color-text-muted)]">
            · {match.whyMatch.length}
          </span>
          <ChevronDown
            size={12}
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Dismiss"
            className="inline-flex h-8 items-center justify-center gap-1 rounded-[8px] px-2.5 text-[11px] font-semibold text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface)] hover:text-[color:var(--color-text-secondary)]"
          >
            <XIcon size={12} />
            Dismiss
          </button>
          <button
            type="button"
            className="inline-flex h-8 items-center justify-center gap-1 rounded-[8px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-2.5 text-[11px] font-semibold text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)]"
          >
            View
            <ExternalLinkIcon size={11} />
          </button>
          <button
            type="button"
            className="inline-flex h-8 items-center justify-center gap-1 rounded-[8px] bg-[color:var(--color-brand-500)] px-2.5 text-[11px] font-semibold text-white shadow-[0_4px_10px_rgba(91,61,245,0.28)] transition-colors hover:bg-[color:var(--color-brand-600)]"
          >
            <PaperPlaneIcon size={11} />
            Introduce
          </button>
        </div>
      </div>

      {/* Why-expanded drawer */}
      {expanded ? (
        <ul
          className="space-y-1 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/30 px-4 py-2.5 sm:px-5"
          aria-label="Match reasons"
        >
          {match.whyMatch.map((reason) => (
            <li
              key={reason}
              className="flex items-start gap-2 text-[12px] leading-[18px] text-[color:var(--color-text-secondary)]"
            >
              <span
                aria-hidden
                className="mt-[6px] inline-flex h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: qualityColor }}
              />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
const SORT_OPTIONS = ["Best Match", "Newest", "Highest Score", "Alphabetical"];

export function MatchesPageClient() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Best Match");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allMatches.filter((m) => {
      const matchesSearch =
        !q ||
        m.candidate.name.toLowerCase().includes(q) ||
        m.job.title.toLowerCase().includes(q) ||
        m.job.company.toLowerCase().includes(q) ||
        m.candidate.skills.some((s) => s.toLowerCase().includes(q));
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "excellent" && m.quality === "Excellent") ||
        (activeTab === "good" && m.quality === "Good") ||
        (activeTab === "fair" && m.quality === "Fair") ||
        (activeTab === "saved" && m.saved);
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleTabChange(key: TabKey) {
    setActiveTab(key);
    setPage(1);
  }

  return (
    <div className="min-h-full space-y-3.5 px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
      {/* Page title */}
      <header>
        <div className="flex items-center gap-2">
          <h1 className="text-[22px] font-bold leading-[30px] tracking-tight text-[color:var(--color-text)] sm:text-[28px] sm:leading-[36px]">
            Matches
          </h1>
        </div>
        <p className="mt-1 text-[13px] text-[color:var(--color-text-secondary)] sm:text-[14px]">
          AI-powered pairings between your candidates and active job postings
        </p>
      </header>

      {/* Hero distribution */}
      <MatchesHero activeTab={activeTab} onQualitySelect={handleTabChange} />

      {/* Filter pill tabs */}
      <MatchTabs active={activeTab} onChange={handleTabChange} />

      {/* Toolbar: search + filters + sort */}
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative block min-w-0 flex-1">
          <span className="sr-only">Search matches</span>
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--color-text-muted)]">
            <SearchIcon size={16} />
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search candidate, company, skill…"
            className="h-10 w-full rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] pl-10 pr-3 text-[13px] text-[color:var(--color-text)] placeholder:text-[color:var(--color-text-muted)] outline-none transition focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)]"
            aria-label="Search matches"
          />
        </label>

        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-semibold text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)]"
        >
          <FilterIcon size={15} />
          <span className="hidden sm:inline">Filters</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (filtered.length === 0) return;
            exportToExcel({
              filename: "matches",
              sheetName: "Matches",
              columns: [
                { header: "Candidate", key: (m: Match) => m.candidate.name, width: 24 },
                { header: "Candidate Role", key: (m: Match) => m.candidate.role, width: 26 },
                { header: "Candidate Location", key: (m: Match) => m.candidate.location, width: 22 },
                { header: "Candidate Experience", key: (m: Match) => m.candidate.experience, width: 16 },
                { header: "Job Title", key: (m: Match) => m.job.title, width: 28 },
                { header: "Company", key: (m: Match) => m.job.company, width: 22 },
                { header: "Job Location", key: (m: Match) => m.job.location, width: 22 },
                { header: "Job Type", key: (m: Match) => m.job.type, width: 14 },
                { header: "Salary", key: (m: Match) => m.job.salary, width: 22 },
                { header: "Source", key: (m: Match) => m.job.source, width: 18 },
                { header: "Match Score", key: "score", type: "number", width: 12 },
                { header: "Quality", key: "quality", width: 12 },
                {
                  header: "Why This Match",
                  key: (m: Match) => m.whyMatch.join(" • "),
                  width: 50,
                },
                {
                  header: "Candidate Skills",
                  key: (m: Match) => m.candidate.skills.join(", "),
                  width: 38,
                },
                {
                  header: "Job Skills",
                  key: (m: Match) => m.job.skills.join(", "),
                  width: 38,
                },
                { header: "Posted", key: (m: Match) => m.job.postedAgo, width: 14 },
                { header: "Saved", key: (m: Match) => (m.saved ? "Yes" : "No"), width: 10 },
                { header: "Match ID", key: "id", width: 14 },
              ],
              rows: filtered,
            });
          }}
          disabled={filtered.length === 0}
          title={`Export ${filtered.length} match${filtered.length === 1 ? "" : "es"} to Excel`}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-semibold text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-brand-300)] hover:bg-[color:var(--color-brand-50)] hover:text-[color:var(--color-brand-600)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <DownloadIcon size={15} />
          <span className="hidden sm:inline">Export</span>
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setSortOpen((s) => !s)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-semibold text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)]"
          >
            <SortIcon size={15} />
            <span className="hidden sm:inline">{sortBy}</span>
            <ChevronDown
              size={14}
              className={`shrink-0 transition-transform ${
                sortOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {sortOpen && (
            <div className="absolute right-0 top-full z-20 mt-1 w-48 overflow-hidden rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-dropdown)]">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setSortBy(opt);
                    setSortOpen(false);
                  }}
                  className={`flex w-full items-center px-4 py-2.5 text-left text-[13px] transition-colors hover:bg-[color:var(--color-surface-2)] ${
                    sortBy === opt
                      ? "font-semibold text-[color:var(--color-brand-600)]"
                      : "text-[color:var(--color-text)]"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between border-y border-[color:var(--color-border)] py-2.5">
        <p className="text-[12px] text-[color:var(--color-text-secondary)]">
          {filtered.length === 0 ? (
            <span>No matches found</span>
          ) : (
            <>
              Showing{" "}
              <span className="font-semibold text-[color:var(--color-text)]">
                {(safePage - 1) * PAGE_SIZE + 1}–
                {Math.min(safePage * PAGE_SIZE, filtered.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[color:var(--color-text)]">
                {filtered.length}
              </span>{" "}
              {filtered.length === 1 ? "match" : "matches"}
            </>
          )}
        </p>
        {totalPages > 1 && (
          <p className="text-[12px] text-[color:var(--color-text-muted)]">
            Page {safePage} of {totalPages}
          </p>
        )}
      </div>

      {/* Match list */}
      {pageItems.length > 0 ? (
        <div className="space-y-2.5" role="list" aria-label="Match results">
          {pageItems.map((match) => (
            <div key={match.id} role="listitem">
              <MatchCard match={match} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[18px] border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-surface)] py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-brand-100)]">
            <SparklesIcon
              size={22}
              className="text-[color:var(--color-brand-500)]"
            />
          </div>
          <p className="text-[15px] font-semibold text-[color:var(--color-text)]">
            No matches found
          </p>
          <p className="mt-1 max-w-sm text-[13px] text-[color:var(--color-text-secondary)]">
            Try a different tab or broaden your search to discover more
            candidate–job pairings.
          </p>
        </div>
      )}

      {/* Pagination */}
      {filtered.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="inline-flex h-9 items-center rounded-[8px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[12px] font-semibold text-[color:var(--color-text-secondary)] transition-colors enabled:hover:border-[color:var(--color-border-strong)] enabled:hover:text-[color:var(--color-text)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
            .reduce<(number | "…")[]>((acc, p, idx, arr) => {
              if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…");
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === "…" ? (
                <span
                  key={`ellipsis-${i}`}
                  className="px-1 text-[13px] text-[color:var(--color-text-muted)]"
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
                      ? "bg-[color:var(--color-brand-500)] text-white"
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
            className="inline-flex h-9 items-center rounded-[8px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[12px] font-semibold text-[color:var(--color-text-secondary)] transition-colors enabled:hover:border-[color:var(--color-border-strong)] enabled:hover:text-[color:var(--color-text)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {sortOpen && (
        <div
          className="fixed inset-0 z-10"
          aria-hidden
          onClick={() => setSortOpen(false)}
        />
      )}
    </div>
  );
}
