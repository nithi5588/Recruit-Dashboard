"use client";

import { useId, useState, useRef, useEffect } from "react";
import {
  BookmarkIcon,
  CheckIcon,
  ClockIcon,
  MoreIcon,
  PinIcon,
  UsersIcon,
} from "@/components/icons/AppIcons";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import {
  scoreTone,
  tooltipForBreakdown,
  type FitBreakdown,
  type Match,
  type MatchTone,
} from "@/lib/matches/types";

// ─── Score-tone palette ───────────────────────────────────────────────────────

const TONE: Record<MatchTone, {
  ring: string;        // ring stroke color (CSS color value)
  ringGlow: string;    // soft halo behind the score ring
  scoreText: string;   // numeric label color
  scoreLabel: string;  // small label under score
  segment: string;     // fit-breakdown segment fill
  chipBg: string;      // skill chip bg
  chipText: string;    // skill chip text
  underline: string;   // active underline (matches tab strip)
  pillBg: string;      // tone pill bg
  pillText: string;    // tone pill text
  pillLabel: string;   // human-readable tone label
}> = {
  excellent: {
    ring: "var(--color-brand-500)",
    ringGlow: "rgba(46, 71, 224, 0.18)",
    scoreText: "text-[color:var(--color-brand-700)]",
    scoreLabel: "text-[color:var(--color-brand-600)]",
    segment: "bg-[color:var(--color-brand-500)]",
    chipBg: "bg-[color:var(--color-brand-100)]",
    chipText: "text-[color:var(--color-brand-700)]",
    underline: "bg-[color:var(--color-brand-500)]",
    pillBg: "bg-[color:var(--color-brand-100)]",
    pillText: "text-[color:var(--color-brand-700)]",
    pillLabel: "Excellent fit",
  },
  good: {
    ring: "var(--color-brand-400)",
    ringGlow: "rgba(46, 71, 224, 0.12)",
    scoreText: "text-[color:var(--color-brand-700)]",
    scoreLabel: "text-[color:var(--color-brand-600)]",
    segment: "bg-[color:var(--color-brand-400)]",
    chipBg: "bg-[color:var(--color-brand-100)]",
    chipText: "text-[color:var(--color-brand-700)]",
    underline: "bg-[color:var(--color-brand-400)]",
    pillBg: "bg-[color:var(--color-brand-50)]",
    pillText: "text-[color:var(--color-brand-700)]",
    pillLabel: "Good fit",
  },
  fair: {
    ring: "var(--color-text-muted)",
    ringGlow: "rgba(102, 112, 133, 0.12)",
    scoreText: "text-[color:var(--color-text)]",
    scoreLabel: "text-[color:var(--color-text-muted)]",
    segment: "bg-[color:var(--color-text-muted)]",
    chipBg: "bg-[color:var(--color-surface-2)]",
    chipText: "text-[color:var(--color-text)]",
    underline: "bg-[color:var(--color-text-muted)]",
    pillBg: "bg-[color:var(--color-surface-2)]",
    pillText: "text-[color:var(--color-text-secondary)]",
    pillLabel: "Fair fit",
  },
};

function segmentTone(value: number): MatchTone {
  return scoreTone(value);
}

// ─── Fit Breakdown bar ────────────────────────────────────────────────────────

const FIT_LABELS: Array<{ key: keyof FitBreakdown; label: string }> = [
  { key: "skills",    label: "Skills"     },
  { key: "location",  label: "Location"   },
  { key: "seniority", label: "Seniority"  },
  { key: "salary",    label: "Salary"     },
];

function FitBar({ match }: { match: Match }) {
  const [tip, setTip] = useState<{ key: keyof FitBreakdown; left: number } | null>(null);
  return (
    <div className="relative">
      <div className="grid grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-4">
        {FIT_LABELS.map((f, i) => {
          const value = match.fitBreakdown[f.key];
          const tone = segmentTone(value);
          return (
            <div
              key={f.key}
              role="img"
              aria-label={tooltipForBreakdown(f.key, value, match)}
              onMouseEnter={() => setTip({ key: f.key, left: (i + 0.5) * 25 })}
              onMouseLeave={() => setTip(null)}
              className="min-w-0"
            >
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-text-muted)]">
                  {f.label}
                </span>
                <span className="text-[11px] font-bold tabular-nums text-[color:var(--color-text)]">
                  {value}
                  <span className="text-[color:var(--color-text-muted)]">%</span>
                </span>
              </div>
              <div className="relative h-1.5 overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
                <span
                  className={`block h-full rounded-full ${TONE[tone].segment} transition-[width] duration-500 ease-out`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {tip && (
        <div
          role="tooltip"
          className="pointer-events-none absolute -top-10 z-20 max-w-[260px] -translate-x-1/2 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-2.5 py-1.5 text-[11px] font-medium text-[color:var(--color-text)] shadow-md"
          style={{ left: `${tip.left}%` }}
        >
          {tooltipForBreakdown(tip.key, match.fitBreakdown[tip.key], match)}
        </div>
      )}
    </div>
  );
}

// ─── Skill chips with overflow popover ────────────────────────────────────────

function SkillChips({ match, tone }: { match: Match; tone: MatchTone }) {
  const VISIBLE = 6;
  const matched = match.matchedSkills;
  const missing = match.missingSkills;
  const visibleMatched = matched.slice(0, VISIBLE);
  const remainingMatched = Math.max(0, matched.length - VISIBLE);
  const slotsLeft = Math.max(0, VISIBLE - visibleMatched.length);
  const visibleMissing = missing.slice(0, slotsLeft);
  const remainingMissing = Math.max(0, missing.length - visibleMissing.length);
  const overflow = remainingMatched + remainingMissing;

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {visibleMatched.map((s) => (
        <span
          key={s}
          title={s}
          className={`inline-flex max-w-[44px] items-center gap-1 overflow-hidden rounded-md px-2 py-0.5 text-[11px] font-medium transition-[max-width] duration-200 ease-out group-hover:max-w-[160px] ${TONE[tone].chipBg} ${TONE[tone].chipText}`}
        >
          <CheckIcon size={10} className="shrink-0" />
          <span className="truncate">{s}</span>
        </span>
      ))}
      {visibleMissing.map((s) => (
        <span
          key={s}
          title={`${s} — required but missing`}
          className="inline-flex max-w-[44px] items-center gap-1 overflow-hidden rounded-md border border-dashed border-[color:var(--color-border-strong)] px-2 py-0.5 text-[11px] font-medium text-[color:var(--color-text-muted)] transition-[max-width] duration-200 ease-out group-hover:max-w-[160px]"
        >
          <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-[color:var(--color-text-muted)]" />
          <span className="truncate">{s}</span>
        </span>
      ))}
      {overflow > 0 && (
        <div ref={ref} className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpen((v) => !v);
            }}
            aria-haspopup="dialog"
            aria-expanded={open}
            className="inline-flex items-center rounded-md bg-[color:var(--color-surface-2)] px-2 py-0.5 text-[11px] font-semibold text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-500)] focus-visible:ring-offset-2"
          >
            +{overflow} more
          </button>
          {open && (
            <div
              role="dialog"
              className="absolute left-0 top-[calc(100%+6px)] z-30 w-[220px] rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {matched.length > 0 && (
                <>
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-text-muted)]">Matched ({matched.length})</p>
                  <div className="mb-2 flex flex-wrap gap-1">
                    {matched.map((s) => (
                      <span key={s} className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${TONE[tone].chipBg} ${TONE[tone].chipText}`}>
                        <CheckIcon size={10} /> {s}
                      </span>
                    ))}
                  </div>
                </>
              )}
              {missing.length > 0 && (
                <>
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-text-muted)]">Missing ({missing.length})</p>
                  <div className="flex flex-wrap gap-1">
                    {missing.map((s) => (
                      <span key={s} className="inline-flex items-center rounded-md border border-dashed border-[color:var(--color-border-strong)] px-2 py-0.5 text-[11px] font-medium text-[color:var(--color-text-muted)]">
                        {s}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Score badge ──────────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }) {
  const tone = scoreTone(score);
  const t = TONE[tone];
  const pct = Math.max(0, Math.min(100, score));
  const size = 64;
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;

  return (
    <span
      role="img"
      aria-label={`Match score: ${score} out of 100, ${tone}`}
      className="relative flex h-16 w-16 shrink-0 items-center justify-center"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-surface-2)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={t.ring}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          style={{ transition: "stroke-dasharray 600ms cubic-bezier(0.22, 0.94, 0.46, 1)" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center leading-none">
        <span className={`text-[20px] font-bold tabular-nums ${t.scoreText}`}>{score}</span>
      </span>
    </span>
  );
}

function FitPill({ score }: { score: number }) {
  const tone = scoreTone(score);
  const t = TONE[tone];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[10px] font-semibold ${t.pillBg} ${t.pillText}`}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: t.ring }}
      />
      {t.pillLabel}
    </span>
  );
}

// ─── MAIN: MatchCard ──────────────────────────────────────────────────────────

export function MatchCard({
  match,
  saved,
  onToggleSave,
  onIntroduce,
  isFocused,
  onFocus,
  registerRef,
}: {
  match: Match;
  saved: boolean;
  onToggleSave: () => void;
  onIntroduce: () => void;
  isFocused?: boolean;
  onFocus?: () => void;
  registerRef?: (el: HTMLDivElement | null) => void;
}) {
  const tone = scoreTone(match.score);
  const cardId = useId();

  function open(e?: React.SyntheticEvent) {
    e?.stopPropagation();
    console.log("open match", match.id);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open(e);
    }
  }

  return (
    <article
      ref={registerRef}
      role="button"
      tabIndex={0}
      aria-labelledby={cardId}
      onClick={open}
      onFocus={onFocus}
      onKeyDown={handleKeyDown}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl border bg-[color:var(--color-surface)] p-5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-500)] focus-visible:ring-offset-2 ${
        isFocused
          ? "border-[color:var(--color-brand-500)] shadow-[0_10px_28px_rgba(46,71,224,0.14)] ring-2 ring-[color:var(--color-brand-200)]"
          : "border-[color:var(--color-border)] hover:-translate-y-[2px] hover:border-[color:var(--color-brand-200)] hover:shadow-[0_10px_28px_rgba(23,26,43,0.08)]"
      }`}
    >
      {/* ROW A — Headline */}
      <div className="relative flex items-start gap-4">
        {/* Score block */}
        <div className="flex shrink-0 flex-col items-center gap-2">
          <ScoreBadge score={match.score} />
          <FitPill score={match.score} />
        </div>

        {/* Candidate + matched job stack */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                aria-hidden
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white"
                style={{ background: match.candidate.avatarColor }}
              >
                {match.candidate.initials}
              </span>
              <div className="min-w-0">
                <p id={cardId} className="truncate text-[15px] font-semibold leading-tight text-[color:var(--color-text)]">
                  {match.candidate.name}
                </p>
                <p className="truncate text-[13px] leading-snug text-[color:var(--color-text-secondary)]">
                  {match.candidate.role}
                </p>
                <p className="truncate text-[12px] leading-snug text-[color:var(--color-text-muted)]">
                  {match.candidate.location} · {match.candidate.experienceLabel}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                aria-label={saved ? "Remove from saved" : "Save match"}
                aria-pressed={saved}
                onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-500)] focus-visible:ring-offset-2 ${
                  saved
                    ? "bg-[color:var(--color-brand-50)] text-[color:var(--color-brand-600)]"
                    : "text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-secondary)]"
                }`}
              >
                <BookmarkIcon size={16} />
              </button>
              <button
                type="button"
                aria-label={`More actions for ${match.candidate.name}`}
                onClick={(e) => e.stopPropagation()}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-500)] focus-visible:ring-offset-2"
              >
                <MoreIcon size={16} />
              </button>
            </div>
          </div>

          {/* Matched job sub-card */}
          <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/60 px-3 py-2.5">
            <span
              aria-hidden
              className="hidden text-[9px] font-bold uppercase tracking-[0.12em] text-[color:var(--color-text-muted)] sm:inline"
            >
              Match
            </span>
            <span aria-hidden className="hidden h-4 w-px bg-[color:var(--color-border)] sm:inline-block" />
            <CompanyLogo
              company={match.job.company}
              size={28}
              fallbackBg={match.job.companyLogoColor}
              fallbackText={match.job.companyLogoText}
              rounded="rounded-md"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold leading-tight text-[color:var(--color-text)]">
                {match.job.title}
              </p>
              <p className="truncate text-[12px] leading-snug text-[color:var(--color-text-secondary)]">
                {match.job.company} · {match.job.salaryLabel}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 h-px w-full bg-[color:var(--color-border)]" />

      {/* ROW B — Fit breakdown */}
      <FitBar match={match} />

      {/* ROW C — Skills */}
      {(match.matchedSkills.length > 0 || match.missingSkills.length > 0) && (
        <div className="mt-4">
          <SkillChips match={match} tone={tone} />
        </div>
      )}

      {/* ROW D — Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--color-border)] pt-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[color:var(--color-text-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon size={12} />
            posted {match.job.postedAgo}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <UsersIcon size={12} />
            {match.job.applicants} applicants
          </span>
          <span className="inline-flex items-center gap-1.5">
            <PinIcon size={12} />
            {match.job.workMode}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); open(e); }}
            className="rounded-md px-3 py-1.5 text-xs font-semibold text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-500)] focus-visible:ring-offset-2"
          >
            View Details
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onIntroduce(); }}
            className="rounded-md bg-[color:var(--color-brand-500)] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[color:var(--color-brand-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-500)] focus-visible:ring-offset-2"
          >
            Introduce
          </button>
        </div>
      </div>
    </article>
  );
}
