"use client";

import { Avatar } from "@/components/ui/Avatar";
import {
  BriefcaseIcon,
  CalendarIcon,
  CheckIcon,
  EditIcon,
  MoneyIcon,
  MoreIcon,
  PaperPlaneIcon,
  PlusIcon,
  TargetIcon,
  TrendUpIcon,
  TrophyIcon,
  UserPlusIcon,
  UsersIcon,
} from "@/components/icons/AppIcons";
import type { MemberDetail } from "@/lib/team-data";
import {
  getMemberTargets,
  type MemberTargets,
  type TargetKind,
  type TargetTone,
  type TargetsActivityKind,
} from "@/lib/team-targets-data";

/* ── Accent palette — mirrors the design exactly; neutrals/brand come from the
   app's CSS tokens so it stays theme-consistent. ──────────────────────────── */
const GREEN = "#16A34A";
const GREEN_SOLID = "#22C55E";
const GREEN_BG = "#EAFBF1";
const ORANGE = "#B45309";
const ORANGE_SOLID = "#F59E0B";
const ORANGE_BG = "#FEF3C7";
const RED = "#DC2626";
const RED_SOLID = "#EF4444";
const BRAND = "var(--color-brand-500)";
const BRAND_SOFT = "var(--color-brand-100)";

const CARD =
  "rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-card)]";

/* Tone → bar / percent text / status-dot colours. */
const TONE: Record<TargetTone, { bar: string; text: string; dot: string }> = {
  good: { bar: GREEN_SOLID, text: GREEN, dot: GREEN_SOLID },
  warn: { bar: ORANGE_SOLID, text: ORANGE, dot: ORANGE_SOLID },
  bad: { bar: RED_SOLID, text: RED, dot: RED_SOLID },
};

/* Per-metric icon tile for the Monthly Targets rows. */
const TARGET_ICON: Record<TargetKind, { bg: string; node: React.ReactNode }> = {
  placements: { bg: GREEN_BG, node: <BriefcaseIcon size={16} style={{ color: GREEN }} /> },
  submittals: {
    bg: BRAND_SOFT,
    node: <PaperPlaneIcon size={16} className="text-[color:var(--color-brand-600)]" />,
  },
  interviews: {
    bg: BRAND_SOFT,
    node: <UsersIcon size={16} className="text-[color:var(--color-brand-600)]" />,
  },
  margin: { bg: GREEN_BG, node: <MoneyIcon size={16} style={{ color: GREEN }} /> },
};

/* ── Small inline glyphs ──────────────────────────────────────────────────── */
function TriangleUp({ size = 9, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 9" fill="none" aria-hidden className="shrink-0">
      <path d="M5 0.5 9.33 8H0.67L5 0.5Z" fill={color} />
    </svg>
  );
}

function QuoteGlyph({ size = 18, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden className="shrink-0">
      <path d="M9.5 7H5.5A1.5 1.5 0 0 0 4 8.5V12a1.5 1.5 0 0 0 1.5 1.5H8v.5a2.5 2.5 0 0 1-2.5 2.5.9.9 0 0 0 0 1.8A4.3 4.3 0 0 0 9.8 14V8.5A1.5 1.5 0 0 0 9.5 7Zm9 0h-4A1.5 1.5 0 0 0 13 8.5V12a1.5 1.5 0 0 0 1.5 1.5H17v.5a2.5 2.5 0 0 1-2.5 2.5.9.9 0 0 0 0 1.8A4.3 4.3 0 0 0 18.8 14V8.5A1.5 1.5 0 0 0 18.5 7Z" />
    </svg>
  );
}

/* ── Monthly Targets ──────────────────────────────────────────────────────── */
function MonthlyTargetsCard({ t }: { t: MemberTargets }) {
  return (
    <div className={`${CARD} p-5 sm:p-6`}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[16px] font-bold text-[color:var(--color-text)]">Monthly Targets</h3>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-2 rounded-[11px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3.5 text-[13px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:bg-[color:var(--color-surface-2)]"
        >
          <EditIcon size={15} />
          Edit Targets
        </button>
      </div>

      <div className="mt-5 space-y-5">
        {t.targets.map((row) => {
          const tone = TONE[row.tone];
          const ic = TARGET_ICON[row.kind];
          return (
            <div key={row.kind} className="flex items-center gap-3 sm:gap-4">
              {/* Icon + label */}
              <div className="flex w-[120px] shrink-0 items-center gap-2.5 sm:w-[150px]">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                  style={{ background: ic.bg }}
                >
                  {ic.node}
                </span>
                <span className="truncate text-[13.5px] font-semibold text-[color:var(--color-text)]">
                  {row.label}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.min(row.percent, 100)}%`, background: tone.bar }}
                />
              </div>

              {/* done / goal */}
              <span className="w-[96px] shrink-0 whitespace-nowrap text-right text-[13px] font-bold text-[color:var(--color-text)]">
                {row.done}
                <span className="font-medium text-[color:var(--color-text-muted)]"> / {row.goal}</span>
              </span>

              {/* percent */}
              <span
                className="w-[44px] shrink-0 text-right text-[13px] font-bold"
                style={{ color: tone.text }}
              >
                {row.percent}%
              </span>

              {/* status dot */}
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: tone.dot }}
                aria-hidden
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Summary cards (Quarterly Goal / Target Streak / Attainment Rate) ──────── */
function QuarterlyGoalCard({ t }: { t: MemberTargets }) {
  const q = t.quarterly;
  return (
    <div className={`${CARD} flex h-full flex-col p-5`}>
      <div className="flex items-start gap-3.5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[color:var(--color-brand-100)]">
          <CalendarIcon size={22} className="text-[color:var(--color-brand-600)]" />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-[color:var(--color-text-secondary)]">
            Quarterly Goal
          </p>
          <p className="mt-1 text-[28px] font-extrabold leading-none tracking-tight text-[color:var(--color-text)]">
            {q.done}{" "}
            <span className="text-[18px] font-semibold text-[color:var(--color-text-muted)]">
              / {q.goal}
            </span>
          </p>
          <p className="mt-1.5 text-[12.5px] text-[color:var(--color-text-muted)]">Placements</p>
        </div>
      </div>
      <div className="mt-auto pt-4">
        <div className="flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
            <div
              className="h-full rounded-full"
              style={{ width: `${q.percent}%`, background: BRAND }}
            />
          </div>
          <span className="shrink-0 text-[15px] font-extrabold tracking-tight text-[color:var(--color-brand-600)]">
            {q.percent}%
          </span>
        </div>
        <p className="mt-2 text-[12px] text-[color:var(--color-text-muted)]">{q.remaining}</p>
      </div>
    </div>
  );
}

function TargetStreakCard({ t }: { t: MemberTargets }) {
  const s = t.streak;
  return (
    <div className={`${CARD} flex h-full flex-col p-5`}>
      <div className="flex items-start gap-3.5">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px]"
          style={{ background: ORANGE_BG }}
        >
          <TrophyIcon size={22} style={{ color: ORANGE_SOLID }} />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-[color:var(--color-text-secondary)]">
            Target Streak
          </p>
          <p className="mt-1 text-[28px] font-extrabold leading-none tracking-tight text-[color:var(--color-text)]">
            {s.months}{" "}
            <span className="text-[18px] font-semibold text-[color:var(--color-text-secondary)]">
              Months
            </span>
          </p>
          <p className="mt-1.5 text-[12.5px] text-[color:var(--color-text-muted)]">Hit Target</p>
        </div>
      </div>
      <p className="mt-auto pt-4 text-[13px] font-semibold" style={{ color: GREEN }}>
        {s.note}
      </p>
    </div>
  );
}

function AttainmentRateCard({ t }: { t: MemberTargets }) {
  const a = t.attainment;
  return (
    <div className={`${CARD} flex h-full flex-col p-5`}>
      <div className="flex items-start gap-3.5">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px]"
          style={{ background: GREEN_BG }}
        >
          <TargetIcon size={22} style={{ color: GREEN }} />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-[color:var(--color-text-secondary)]">
            Attainment Rate
          </p>
          <p className="mt-1 text-[28px] font-extrabold leading-none tracking-tight text-[color:var(--color-text)]">
            {a.percent}%
          </p>
          <p className="mt-1.5 text-[12.5px] text-[color:var(--color-text-muted)]">Overall</p>
        </div>
      </div>
      <p className="mt-auto flex items-center gap-1.5 pt-4 text-[12.5px]">
        <span className="inline-flex items-center gap-1 font-bold" style={{ color: GREEN }}>
          <TriangleUp color={GREEN} />
          {a.delta}
        </span>
        <span className="text-[color:var(--color-text-muted)]">vs last quarter</span>
      </p>
    </div>
  );
}

/* ── Recent Activity ──────────────────────────────────────────────────────── */
const ACTIVITY_STYLE: Record<
  TargetsActivityKind,
  { bg: string; fg: string; icon: React.ReactNode }
> = {
  placed: { bg: GREEN_BG, fg: GREEN, icon: <CheckIcon size={15} /> },
  interview: { bg: BRAND_SOFT, fg: "var(--color-brand-600)", icon: <CalendarIcon size={15} /> },
  submitted: { bg: BRAND_SOFT, fg: "var(--color-brand-600)", icon: <PaperPlaneIcon size={15} /> },
  added: { bg: ORANGE_BG, fg: ORANGE_SOLID, icon: <UserPlusIcon size={15} /> },
  moved: { bg: BRAND_SOFT, fg: "var(--color-brand-600)", icon: <TrendUpIcon size={15} /> },
  joined: { bg: GREEN_BG, fg: GREEN, icon: <CheckIcon size={15} /> },
};

function RecentActivityCard({ t }: { t: MemberTargets }) {
  return (
    <div className={`${CARD} flex h-full flex-col p-5 sm:p-6`}>
      <h3 className="text-[16px] font-bold text-[color:var(--color-text)]">Recent Activity</h3>
      <ul className="mt-5 space-y-4">
        {t.activity.map((a, i) => {
          const s = ACTIVITY_STYLE[a.kind];
          return (
            <li key={i} className="flex items-center gap-3">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                style={{ background: s.bg, color: s.fg }}
              >
                {s.icon}
              </span>
              <p className="min-w-0 flex-1 truncate text-[13px] text-[color:var(--color-text)]">
                {a.text}
              </p>
              <span className="shrink-0 whitespace-nowrap text-[12px] text-[color:var(--color-text-muted)]">
                {a.time}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="mt-5 flex justify-center border-t border-[color:var(--color-border)] pt-4">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:text-[color:var(--color-brand-500)]"
        >
          View all activity
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}

/* ── Admin Notes ──────────────────────────────────────────────────────────── */
function AdminNotesCard({ t }: { t: MemberTargets }) {
  return (
    <div className={`${CARD} flex h-full flex-col p-5 sm:p-6`}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[16px] font-bold text-[color:var(--color-text)]">Admin Notes</h3>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-1.5 rounded-[11px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3.5 text-[13px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:bg-[color:var(--color-surface-2)]"
        >
          <PlusIcon size={15} />
          Add Note
        </button>
      </div>

      <div className="mt-5 space-y-4">
        {t.notes.map((note, i) => (
          <div
            key={i}
            className="relative rounded-[14px] bg-[color:var(--color-brand-50)] p-4 pr-10"
          >
            <button
              type="button"
              aria-label="Note actions"
              className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-[8px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface)] hover:text-[color:var(--color-text)]"
            >
              <MoreIcon size={16} />
            </button>
            <div className="flex gap-2.5">
              <span className="mt-0.5 shrink-0 text-[color:var(--color-brand-400)]">
                <QuoteGlyph size={18} color="var(--color-brand-400)" />
              </span>
              <div className="min-w-0 space-y-0.5">
                {note.lines.map((line, j) => (
                  <p
                    key={j}
                    className="text-[13.5px] font-medium leading-[20px] text-[color:var(--color-text)]"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 pl-7">
              <Avatar name={note.author} size={22} />
              <span className="text-[12.5px] text-[color:var(--color-text-secondary)]">
                {note.author}
                <span className="mx-1 text-[color:var(--color-text-muted)]">•</span>
                {note.date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Targets & Activity tab body ──────────────────────────────────────────── */
export function TargetsActivityTab({ member }: { member: MemberDetail }) {
  const t = getMemberTargets(member.slug);
  return (
    <div className="space-y-5">
      <MonthlyTargetsCard t={t} />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <QuarterlyGoalCard t={t} />
        <TargetStreakCard t={t} />
        <AttainmentRateCard t={t} />
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-2">
        <RecentActivityCard t={t} />
        <AdminNotesCard t={t} />
      </div>
    </div>
  );
}
