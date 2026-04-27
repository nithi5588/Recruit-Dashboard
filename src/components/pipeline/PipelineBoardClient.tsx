"use client";

import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import {
  BookmarkIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDown,
  ClockIcon,
  FilterIcon,
  GridViewIcon,
  ListViewIcon,
  MoreIcon,
  PaperPlaneIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  SortIcon,
  SuitcaseIcon,
  TargetIcon,
  TrendUpIcon,
  TrophyIcon,
  UsersIcon,
  XIcon,
} from "@/components/icons/AppIcons";
import {
  PIPELINE_STAGES,
  pipelineCards as INITIAL_CARDS,
  pipelineOwners,
  type PipelineCard,
  type PipelinePriority,
  type PipelineStage,
  type PipelineStageId,
} from "@/lib/pipeline-data";

// ─── Types & constants ────────────────────────────────────────────────────────

type SortKey =
  | "default"
  | "score-desc"
  | "score-asc"
  | "priority"
  | "recent"
  | "name";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "default",    label: "Default order" },
  { key: "score-desc", label: "Score (high → low)" },
  { key: "score-asc",  label: "Score (low → high)" },
  { key: "priority",   label: "Priority (High first)" },
  { key: "recent",     label: "Most recent activity" },
  { key: "name",       label: "Name (A → Z)" },
];

const PRIORITY_RANK: Record<PipelinePriority, number> = { High: 0, Medium: 1, Low: 2 };

const PRIORITY_STYLES: Record<PipelinePriority, { bg: string; fg: string; dot: string }> = {
  High:   { bg: "#C4CBF6", fg: "#20319C", dot: "#20319C" },
  Medium: { bg: "#F2F3FD", fg: "#273DC0", dot: "#5C6FE7" },
  Low:    { bg: "#E6E9FB", fg: "#273DC0", dot: "#2E47E0" },
};

// Mock weekly flow + per-stage averages (lightweight UI-only data)
const FLOW_DAYS  = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const FLOW_DATA  = [11, 14, 12, 15, 16, 13, 12];
const STAGE_AVG_DAYS: Record<PipelineStageId, string> = {
  new:         "1.2 days",
  shortlisted: "2.8 days",
  submitted:   "3.5 days",
  interview:   "4.1 days",
  offered:     "2.3 days",
  placed:      "1.6 days",
  rejected:    "—",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseRecency(updated: string): number {
  const m = updated.match(/(\d+)\s*(m|h|d|w)/i);
  if (!m) return 99999;
  const n = parseInt(m[1], 10);
  const unit = m[2].toLowerCase();
  if (unit === "m") return n;
  if (unit === "h") return n * 60;
  if (unit === "d") return n * 60 * 24;
  return n * 60 * 24 * 7;
}

function uid() {
  return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

const STAGE_AVATAR_COLORS = ["#2E47E0", "#525252", "#5C6FE7", "#20319C"];

function pickAvatarColor() {
  return STAGE_AVATAR_COLORS[Math.floor(Math.random() * STAGE_AVATAR_COLORS.length)];
}

function nameToInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}

function useClickOutside(ref: React.RefObject<HTMLElement | null>, onClose: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [ref, onClose, active]);
}

// ─── Stage icon mapping ───────────────────────────────────────────────────────

function StageIcon({ id, size = 14 }: { id: PipelineStageId; size?: number }) {
  switch (id) {
    case "new":         return <UsersIcon size={size} />;
    case "shortlisted": return <BookmarkIcon size={size} />;
    case "submitted":   return <PaperPlaneIcon size={size} />;
    case "interview":   return <CalendarIcon size={size} />;
    case "offered":     return <SuitcaseIcon size={size} />;
    case "placed":      return <CheckIcon size={size} />;
    case "rejected":    return <XIcon size={size} />;
  }
}

// ─── Priority chip ────────────────────────────────────────────────────────────

function PriorityChip({ p }: { p: PipelinePriority }) {
  const s = PRIORITY_STYLES[p];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
      style={{ background: s.bg, color: s.fg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.dot }} />
      {p}
    </span>
  );
}

// ─── Card More menu ───────────────────────────────────────────────────────────

function CardMoreMenu({
  card, onClose, onMove, onDelete,
}: {
  card: PipelineCard;
  onClose: () => void;
  onMove: (s: PipelineStageId) => void;
  onDelete: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onClose, true);
  return (
    <div
      ref={ref}
      role="menu"
      className="absolute right-1 top-7 z-30 w-[200px] overflow-hidden rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-dropdown)]"
    >
      <p className="border-b border-[color:var(--color-border)] px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-text-muted)]">
        Move to stage
      </p>
      <div className="py-1">
        {PIPELINE_STAGES.map((s) => {
          const isCurrent = s.id === card.stage;
          return (
            <button
              key={s.id}
              type="button"
              role="menuitem"
              disabled={isCurrent}
              onClick={() => { if (!isCurrent) onMove(s.id); onClose(); }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12px] font-medium text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-surface-2)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span aria-hidden className="h-2 w-2 shrink-0 rounded-full" style={{ background: s.color }} />
              <span className="flex-1 truncate">{s.label}</span>
              {isCurrent ? <CheckIcon size={12} className="text-[color:var(--color-brand-500)]" /> : null}
            </button>
          );
        })}
      </div>
      <div className="border-t border-[color:var(--color-border)] py-1">
        <button
          type="button"
          role="menuitem"
          onClick={() => { onDelete(); onClose(); }}
          className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12px] font-medium text-[color:var(--color-error)] transition-colors hover:bg-[color:var(--color-error-light)]"
        >
          <XIcon size={12} />
          Remove from pipeline
        </button>
      </div>
    </div>
  );
}

// ─── Candidate card ───────────────────────────────────────────────────────────

function CandidateCard({
  card, stage, isDragging, menuOpen, onToggleMenu, onMove, onDelete, onDragStart, onDragEnd,
}: {
  card: PipelineCard;
  stage: PipelineStage;
  isDragging: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onMove: (s: PipelineStageId) => void;
  onDelete: () => void;
  onDragStart: (e: DragEvent<HTMLElement>) => void;
  onDragEnd: () => void;
}) {
  const isInterview = card.stage === "interview";

  return (
    <article
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`group relative cursor-grab rounded-[14px] border bg-[color:var(--color-surface)] p-3 shadow-[0_1px_2px_rgba(10,10,10,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] active:cursor-grabbing ${
        isDragging
          ? "border-[color:var(--color-brand-500)] opacity-50"
          : "border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)]"
      }`}
    >
      {/* Header */}
      <div className="mb-2.5 flex items-start gap-2.5">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
          style={{ background: card.avatarColor }}
        >
          {card.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold leading-tight text-[color:var(--color-text)]">
            {card.name}
          </p>
          <p className="mt-0.5 truncate text-[11px] text-[color:var(--color-text-secondary)]">
            {card.role}
          </p>
        </div>
        <button
          type="button"
          aria-label="Card actions"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={(e) => { e.stopPropagation(); onToggleMenu(); }}
          className="rounded-[6px] p-1 text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)] sm:opacity-0 sm:group-hover:opacity-100"
        >
          <MoreIcon size={14} />
        </button>
        {menuOpen ? (
          <CardMoreMenu card={card} onClose={onToggleMenu} onMove={onMove} onDelete={onDelete} />
        ) : null}
      </div>

      {/* Score row — full width bar with % on the right */}
      <div className="mb-2 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
          <div
            className="h-full rounded-full transition-[width] duration-500"
            style={{ width: `${card.score}%`, background: stage.color }}
          />
        </div>
        <span className="shrink-0 text-[11px] font-bold text-[color:var(--color-text)] tabular-nums">
          {card.score}%
        </span>
      </div>

      {/* Interview round chip — only shown for interview stage cards */}
      {isInterview ? (
        <div
          className="mb-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/60 px-2.5 py-2"
        >
          <p className="text-[11px] font-semibold text-[color:var(--color-text)]">
            {card.nextStep}
          </p>
          <p className="mt-1 inline-flex items-center gap-1 text-[10.5px] text-[color:var(--color-text-secondary)]">
            <CalendarIcon size={11} className="text-[color:var(--color-brand-500)]" />
            {card.updated}
          </p>
        </div>
      ) : null}

      {/* Footer — stage age + priority */}
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--color-surface-2)] px-2 py-0.5 text-[10px] font-semibold text-[color:var(--color-text-secondary)]">
          <ClockIcon size={10} />
          {card.ageInStage} in stage
        </span>
        <PriorityChip p={card.priority} />
      </div>
    </article>
  );
}

// ─── Column header (lightweight, no card) ─────────────────────────────────────

function ColumnHeader({
  stage, count, description,
}: {
  stage: PipelineStage;
  count: number;
  description: string;
}) {
  return (
    <div className="mb-2.5 px-1">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-[13px] font-bold text-[color:var(--color-text)]">
            {stage.label}
          </span>
          <span
            className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-md px-1.5 text-[11px] font-bold tabular-nums"
            style={{ background: stage.soft, color: stage.color }}
          >
            {count}
          </span>
        </div>
        <button
          type="button"
          aria-label={`More ${stage.label} options`}
          className="flex h-6 w-6 items-center justify-center rounded-[6px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
        >
          <MoreIcon size={14} />
        </button>
      </div>
      <p className="mt-0.5 truncate text-[10.5px] text-[color:var(--color-text-muted)]">
        {description}
      </p>
    </div>
  );
}

// ─── Inline Add Card form ─────────────────────────────────────────────────────

function AddCardForm({
  stage, onSubmit, onCancel,
}: {
  stage: PipelineStage;
  onSubmit: (data: { name: string; role: string; priority: PipelinePriority }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [priority, setPriority] = useState<PipelinePriority>("Medium");

  function handleSubmit() {
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), role: role.trim() || "Candidate", priority });
  }

  return (
    <div
      className="rounded-[14px] border bg-[color:var(--color-surface)] p-3 shadow-[var(--shadow-card)]"
      style={{ borderColor: stage.color }}
    >
      <input
        autoFocus
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") onCancel(); }}
        placeholder="Candidate name"
        className="mb-2 h-8 w-full rounded-[8px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-base)] px-2.5 text-[12.5px] font-semibold text-[color:var(--color-text)] outline-none placeholder:font-normal placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-brand-500)]"
      />
      <input
        type="text"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") onCancel(); }}
        placeholder="Role / position"
        className="mb-2 h-8 w-full rounded-[8px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-base)] px-2.5 text-[11.5px] text-[color:var(--color-text-secondary)] outline-none placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-brand-500)]"
      />
      <div className="mb-3 flex items-center gap-1">
        {(["High", "Medium", "Low"] as const).map((p) => {
          const active = p === priority;
          const s = PRIORITY_STYLES[p];
          return (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold transition-all"
              style={{
                background: active ? s.bg : "transparent",
                color: active ? s.fg : "var(--color-text-muted)",
                border: `1px solid ${active ? s.bg : "var(--color-border)"}`,
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.dot }} />
              {p}
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={onCancel}
          className="h-7 rounded-[6px] px-2.5 text-[11px] font-semibold text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!name.trim()}
          onClick={handleSubmit}
          className="h-7 rounded-[6px] bg-[color:var(--color-brand-500)] px-3 text-[11px] font-semibold text-white shadow-[0_2px_8px_rgba(46,71,224,0.3)] transition-all enabled:hover:bg-[color:var(--color-brand-600)] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          Add card
        </button>
      </div>
    </div>
  );
}

// ─── Stage breadcrumb pill ────────────────────────────────────────────────────

function StagePill({
  stage, count, active, onClick,
}: {
  stage: PipelineStage;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 transition-all ${
        active
          ? "border-transparent bg-[color:var(--color-surface)]"
          : "border-[color:var(--color-border)] bg-[color:var(--color-surface)] hover:bg-[color:var(--color-surface-2)]"
      }`}
      style={active ? { boxShadow: `0 0 0 1.5px ${stage.color}, var(--shadow-card)` } : { boxShadow: "var(--shadow-card)" }}
    >
      <span
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
        style={{ background: stage.soft, color: stage.color }}
      >
        <StageIcon id={stage.id} size={11} />
      </span>
      <span className={`text-[12px] font-semibold ${active ? "text-[color:var(--color-text)]" : "text-[color:var(--color-text-secondary)]"}`}>
        {stage.label}
      </span>
      <span
        className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10.5px] font-bold tabular-nums"
        style={{ background: stage.soft, color: stage.color }}
      >
        {count}
      </span>
    </button>
  );
}

function PillArrow() {
  return (
    <span aria-hidden className="hidden shrink-0 items-center text-[color:var(--color-text-muted)] sm:flex">
      <span className="mx-0.5 inline-flex items-center gap-0.5 text-[10px]">
        <span className="h-px w-1.5 bg-[color:var(--color-border-strong)]" />
        <span className="h-px w-1.5 bg-[color:var(--color-border-strong)]" />
        <span className="h-px w-1.5 bg-[color:var(--color-border-strong)]" />
        <span className="ml-0.5 leading-none">›</span>
      </span>
    </span>
  );
}

// ─── Bottom analytics panel ───────────────────────────────────────────────────

function CandidatesFlowChart({ data }: { data: number[] }) {
  const w = 380;
  const h = 120;
  const padX = 12;
  const padY = 18;
  const max = Math.max(...data, 1);
  const min = 0;
  const stepX = (w - padX * 2) / (data.length - 1);
  const points = data.map((v, i) => {
    const x = padX + i * stepX;
    const y = padY + (1 - (v - min) / (max - min || 1)) * (h - padY * 2);
    return { x, y, v };
  });

  // Smooth Bezier path
  const path = points
    .map((p, i, arr) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = arr[i - 1];
      const cx = (prev.x + p.x) / 2;
      return `Q ${cx} ${prev.y} ${cx} ${(prev.y + p.y) / 2} T ${p.x} ${p.y}`;
    })
    .join(" ");

  const areaPath = `${path} L ${points[points.length - 1].x} ${h - padY / 2} L ${points[0].x} ${h - padY / 2} Z`;

  const peakIdx = data.indexOf(max);
  const peak = points[peakIdx];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-[140px] w-full">
      <defs>
        <linearGradient id="flow-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="var(--color-brand-500)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* gridlines */}
      {[0.25, 0.5, 0.75].map((p) => (
        <line
          key={p}
          x1={padX} x2={w - padX}
          y1={padY + p * (h - padY * 2)} y2={padY + p * (h - padY * 2)}
          stroke="var(--color-border)"
          strokeDasharray="2 4"
        />
      ))}
      <path d={areaPath} fill="url(#flow-fill)" />
      <path d={path} fill="none" stroke="var(--color-brand-500)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
      {/* dots */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={i === peakIdx ? 4 : 2.5}
          fill="var(--color-surface)" stroke="var(--color-brand-500)" strokeWidth="2" />
      ))}
      {/* peak label */}
      <g transform={`translate(${peak.x}, ${peak.y - 14})`}>
        <rect x="-12" y="-12" width="24" height="18" rx="6" fill="var(--color-brand-500)" />
        <text x="0" y="1" textAnchor="middle" dominantBaseline="middle"
          fontSize="10" fontWeight="700" fill="#fff">{max}</text>
      </g>
    </svg>
  );
}

function PipelineInsightsPanel({
  totalCount, grouped,
}: {
  totalCount: number;
  grouped: Record<PipelineStageId, PipelineCard[]>;
}) {
  // Stage-to-stage conversion (current count[next] / current count[current])
  const transitions: { from: PipelineStage; to: PipelineStage; pct: number }[] = [];
  const order: PipelineStageId[] = ["new", "shortlisted", "submitted", "interview", "offered", "placed"];
  for (let i = 0; i < order.length - 1; i++) {
    const from = PIPELINE_STAGES.find((s) => s.id === order[i])!;
    const to   = PIPELINE_STAGES.find((s) => s.id === order[i + 1])!;
    const a = grouped[from.id].length;
    const b = grouped[to.id].length;
    const pct = a === 0 ? 0 : Math.min(100, Math.round((b / a) * 100));
    transitions.push({ from, to, pct });
  }
  const overall = grouped.placed.length === 0 || totalCount === 0
    ? 0
    : Math.round((grouped.placed.length / totalCount) * 100);

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.4fr_1.2fr_1fr]">
      {/* Pipeline Insights — chart */}
      <section className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="text-[13px] font-bold text-[color:var(--color-text)]">Pipeline Insights</h3>
          <button type="button" className="inline-flex items-center gap-1 rounded-[8px] border border-[color:var(--color-border)] px-2 py-1 text-[11px] font-medium text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)]">
            This Week <ChevronDown size={11} />
          </button>
        </div>
        <p className="mb-1 text-[11px] font-semibold text-[color:var(--color-text-secondary)]">Candidates Flow</p>
        <CandidatesFlowChart data={FLOW_DATA} />
        <div className="mt-1 grid grid-cols-7 gap-1 text-center text-[10px] text-[color:var(--color-text-muted)]">
          {FLOW_DAYS.map((d) => <span key={d}>{d}</span>)}
        </div>
      </section>

      {/* Stage Conversion */}
      <section className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="text-[13px] font-bold text-[color:var(--color-text)]">Stage Conversion</h3>
          <span className="rounded-full bg-[color:var(--color-brand-100)] px-2 py-0.5 text-[10px] font-bold text-[color:var(--color-brand-600)]">
            {overall}% overall
          </span>
        </div>
        <p className="mb-3 text-[11px] text-[color:var(--color-text-secondary)]">Overall Conversion Rate</p>
        <div className="grid grid-cols-1 gap-x-3 gap-y-2.5 sm:grid-cols-2">
          {transitions.map(({ from, to, pct }) => (
            <div key={`${from.id}-${to.id}`}>
              <div className="mb-1 flex items-center justify-between gap-2 text-[10.5px]">
                <span className="truncate font-semibold text-[color:var(--color-text)]">
                  {from.label}{" "}
                  <span className="text-[color:var(--color-text-muted)]">→</span>{" "}
                  <span className="text-[color:var(--color-text-secondary)]">{to.label}</span>
                </span>
                <span className="shrink-0 font-bold text-[color:var(--color-text)] tabular-nums">{pct}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
                <div className="h-full rounded-full transition-[width] duration-500"
                  style={{ width: `${pct}%`, background: from.color }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Time in Stage Avg */}
      <section className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="text-[13px] font-bold text-[color:var(--color-text)]">Time in Stage</h3>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-text-muted)]">By Stage</span>
        </div>
        <p className="mb-3 text-[11px] text-[color:var(--color-text-secondary)]">Average duration</p>
        <div className="grid grid-cols-2 gap-2">
          {PIPELINE_STAGES.filter((s) => s.id !== "rejected").map((s) => (
            <div
              key={s.id}
              className="rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/50 px-2.5 py-2"
            >
              <p className="truncate text-[10.5px] font-medium text-[color:var(--color-text-secondary)]">
                {s.label}
              </p>
              <p className="mt-0.5 text-[13px] font-bold tabular-nums" style={{ color: s.color }}>
                {STAGE_AVG_DAYS[s.id]}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Empty column placeholder ─────────────────────────────────────────────────

function EmptyColumn() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[12px] border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/40 px-4 py-8 text-center">
      <UsersIcon size={20} className="text-[color:var(--color-text-muted)]" />
      <p className="mt-2 text-[11px] font-semibold text-[color:var(--color-text-secondary)]">No candidates yet</p>
      <p className="mt-0.5 text-[10px] text-[color:var(--color-text-muted)]">Drag a card here or add one</p>
    </div>
  );
}

// ─── Main Pipeline Board ──────────────────────────────────────────────────────

export function PipelineBoardClient() {
  const [cards, setCards] = useState<PipelineCard[]>(INITIAL_CARDS);
  const [query, setQuery] = useState("");
  const [focus, setFocus] = useState<PipelineStageId | "all">("all");
  const [view, setView] = useState<"board" | "list">("board");

  const [sortKey, setSortKey] = useState<SortKey>("default");
  const [sortOpen, setSortOpen] = useState(false);
  const [priorityFilters, setPriorityFilters] = useState<Set<PipelinePriority>>(new Set());
  const [ownerFilters, setOwnerFilters] = useState<Set<string>>(new Set());
  const [filterOpen, setFilterOpen] = useState(false);

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<PipelineStageId | null>(null);

  const [menuCardId, setMenuCardId] = useState<string | null>(null);
  const [addingTo, setAddingTo] = useState<PipelineStageId | null>(null);

  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  useClickOutside(sortRef, () => setSortOpen(false), sortOpen);
  useClickOutside(filterRef, () => setFilterOpen(false), filterOpen);

  // ─── Mutations ─────────────────────────────────────────────────────────────
  function moveCard(cardId: string, toStage: PipelineStageId) {
    setCards((prev) =>
      prev.map((c) => c.id === cardId ? { ...c, stage: toStage, ageInStage: "just now", updated: "just now" } : c),
    );
  }
  function deleteCard(cardId: string) {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
  }
  function addCard(stage: PipelineStageId, data: { name: string; role: string; priority: PipelinePriority }) {
    const owner = pipelineOwners[0];
    const card: PipelineCard = {
      id: uid(),
      name: data.name,
      initials: nameToInitials(data.name) || "??",
      avatarColor: pickAvatarColor(),
      role: data.role,
      location: "—",
      priority: data.priority,
      score: 70,
      ageInStage: "just now",
      updated: "just now",
      owner: { name: owner.name, initials: owner.initials, color: owner.color },
      nextStep: "Review profile",
      tags: [],
      stage,
    };
    setCards((prev) => [card, ...prev]);
    setAddingTo(null);
  }

  // ─── Filter / sort / group ─────────────────────────────────────────────────
  const filteredCards = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cards.filter((c) => {
      if (q && !`${c.name} ${c.role} ${c.tags.join(" ")} ${c.owner.name}`.toLowerCase().includes(q)) return false;
      if (priorityFilters.size > 0 && !priorityFilters.has(c.priority)) return false;
      if (ownerFilters.size > 0 && !ownerFilters.has(c.owner.initials)) return false;
      return true;
    });
  }, [cards, query, priorityFilters, ownerFilters]);

  const sortedCards = useMemo(() => {
    if (sortKey === "default") return filteredCards;
    const arr = [...filteredCards];
    if (sortKey === "score-desc") arr.sort((a, b) => b.score - a.score);
    else if (sortKey === "score-asc") arr.sort((a, b) => a.score - b.score);
    else if (sortKey === "priority") arr.sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);
    else if (sortKey === "recent") arr.sort((a, b) => parseRecency(a.updated) - parseRecency(b.updated));
    else if (sortKey === "name") arr.sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }, [filteredCards, sortKey]);

  const grouped = useMemo(() => {
    const by: Record<PipelineStageId, PipelineCard[]> = {
      new: [], shortlisted: [], submitted: [], interview: [], offered: [], placed: [], rejected: [],
    };
    for (const c of sortedCards) by[c.stage].push(c);
    return by;
  }, [sortedCards]);

  const totalCount = cards.length;
  const visibleStages = focus === "all" ? PIPELINE_STAGES : PIPELINE_STAGES.filter((s) => s.id === focus);

  const activeCount = cards.filter((c) => c.stage !== "placed" && c.stage !== "rejected").length;
  const highPriorityCount = cards.filter((c) => c.priority === "High").length;
  const placedCount = cards.filter((c) => c.stage === "placed").length;
  const conversionPct = totalCount === 0 ? 0 : Math.round((placedCount / totalCount) * 100);

  const activeFilterCount = priorityFilters.size + ownerFilters.size;

  // ─── DnD handlers ──────────────────────────────────────────────────────────
  function handleDragStart(e: DragEvent<HTMLElement>, cardId: string) {
    setDraggingId(cardId);
    e.dataTransfer.effectAllowed = "move";
    try { e.dataTransfer.setData("text/plain", cardId); } catch { /* ignore */ }
  }
  function handleDragEnd() { setDraggingId(null); setDragOverStage(null); }
  function handleColumnDragOver(e: DragEvent<HTMLElement>, stageId: PipelineStageId) {
    if (!draggingId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverStage !== stageId) setDragOverStage(stageId);
  }
  function handleColumnDrop(e: DragEvent<HTMLElement>, stageId: PipelineStageId) {
    e.preventDefault();
    const cardId = draggingId ?? e.dataTransfer.getData("text/plain");
    if (cardId) {
      const card = cards.find((c) => c.id === cardId);
      if (card && card.stage !== stageId) moveCard(cardId, stageId);
    }
    setDraggingId(null);
    setDragOverStage(null);
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-full bg-[color:var(--color-bg-base)] px-4 py-6 sm:px-6 xl:px-8 xl:py-8">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[22px] font-bold tracking-tight text-[color:var(--color-text)] sm:text-[26px]">
              Pipeline
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--color-brand-100)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-brand-600)]">
              <SparklesIcon size={10} /> Live
            </span>
          </div>
          <p className="mt-0.5 text-[13px] text-[color:var(--color-text-secondary)]">
            Track and manage candidates as they move through your hiring process.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View toggle */}
          <div className="flex h-9 items-center rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-0.5 shadow-[var(--shadow-card)]">
            <button
              type="button"
              aria-pressed={view === "board"}
              onClick={() => setView("board")}
              className={`flex h-full items-center gap-1.5 rounded-[8px] px-2.5 text-[12px] font-semibold transition-colors ${
                view === "board"
                  ? "bg-[color:var(--color-brand-100)] text-[color:var(--color-brand-600)]"
                  : "text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text)]"
              }`}
            >
              <GridViewIcon size={13} /> Board
            </button>
            <button
              type="button"
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
              className={`flex h-full items-center gap-1.5 rounded-[8px] px-2.5 text-[12px] font-semibold transition-colors ${
                view === "list"
                  ? "bg-[color:var(--color-brand-100)] text-[color:var(--color-brand-600)]"
                  : "text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text)]"
              }`}
            >
              <ListViewIcon size={13} /> List
            </button>
          </div>

          {/* Sort */}
          <div className="relative" ref={sortRef}>
            <button
              type="button"
              onClick={() => setSortOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={sortOpen}
              className={`flex h-9 items-center gap-2 rounded-[10px] border bg-[color:var(--color-surface)] px-3 text-[12px] font-medium shadow-[var(--shadow-card)] transition-colors ${
                sortKey !== "default"
                  ? "border-[color:var(--color-brand-300)] text-[color:var(--color-brand-600)] hover:bg-[color:var(--color-brand-50)]"
                  : "border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
              }`}
            >
              <SortIcon size={13} />
              <span className="hidden sm:inline">{SORT_OPTIONS.find((s) => s.key === sortKey)?.label ?? "Sort"}</span>
              <ChevronDown size={12} className={`transition-transform ${sortOpen ? "rotate-180" : ""}`} />
            </button>
            {sortOpen ? (
              <div role="menu" className="absolute right-0 top-full z-30 mt-1.5 w-[220px] overflow-hidden rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-dropdown)]">
                {SORT_OPTIONS.map((opt) => {
                  const active = opt.key === sortKey;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      role="menuitem"
                      onClick={() => { setSortKey(opt.key); setSortOpen(false); }}
                      className={`flex w-full items-center justify-between px-3 py-2 text-left text-[12px] font-medium transition-colors hover:bg-[color:var(--color-surface-2)] ${
                        active ? "text-[color:var(--color-brand-600)]" : "text-[color:var(--color-text)]"
                      }`}
                    >
                      {opt.label}
                      {active ? <CheckIcon size={12} /> : null}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          {/* Filter */}
          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => setFilterOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={filterOpen}
              className={`flex h-9 items-center gap-2 rounded-[10px] border bg-[color:var(--color-surface)] px-3 text-[12px] font-medium shadow-[var(--shadow-card)] transition-colors ${
                activeFilterCount > 0
                  ? "border-[color:var(--color-brand-300)] text-[color:var(--color-brand-600)] hover:bg-[color:var(--color-brand-50)]"
                  : "border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
              }`}
            >
              <FilterIcon size={13} />
              <span className="hidden sm:inline">Filter</span>
              {activeFilterCount > 0 ? (
                <span className="inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[color:var(--color-brand-500)] px-1 text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              ) : null}
            </button>
            {filterOpen ? (
              <div role="menu" className="absolute right-0 top-full z-30 mt-1.5 w-[260px] overflow-hidden rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-dropdown)]">
                <div className="border-b border-[color:var(--color-border)] p-3">
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-text-muted)]">Priority</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(["High", "Medium", "Low"] as const).map((p) => {
                      const active = priorityFilters.has(p);
                      const s = PRIORITY_STYLES[p];
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => {
                            setPriorityFilters((prev) => {
                              const next = new Set(prev);
                              if (next.has(p)) next.delete(p);
                              else next.add(p);
                              return next;
                            });
                          }}
                          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors"
                          style={{
                            background: active ? s.bg : "transparent",
                            color: active ? s.fg : "var(--color-text-secondary)",
                            border: `1px solid ${active ? s.bg : "var(--color-border)"}`,
                          }}
                        >
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.dot }} />
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border-b border-[color:var(--color-border)] p-3">
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-text-muted)]">Owner</p>
                  <div className="grid grid-cols-1 gap-1">
                    {pipelineOwners.map((o) => {
                      const active = ownerFilters.has(o.initials);
                      return (
                        <button
                          key={o.initials}
                          type="button"
                          onClick={() => {
                            setOwnerFilters((prev) => {
                              const next = new Set(prev);
                              if (next.has(o.initials)) next.delete(o.initials);
                              else next.add(o.initials);
                              return next;
                            });
                          }}
                          className={`flex items-center gap-2 rounded-[6px] px-2 py-1 text-left transition-colors ${
                            active ? "bg-[color:var(--color-brand-50)]" : "hover:bg-[color:var(--color-surface-2)]"
                          }`}
                        >
                          <span className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ background: o.color }}>
                            {o.initials}
                          </span>
                          <span className="flex-1 text-[12px] font-medium text-[color:var(--color-text)]">{o.name}</span>
                          {active ? <CheckIcon size={12} className="text-[color:var(--color-brand-500)]" /> : null}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between p-2">
                  <button
                    type="button"
                    onClick={() => { setPriorityFilters(new Set()); setOwnerFilters(new Set()); }}
                    disabled={activeFilterCount === 0}
                    className="text-[11px] font-semibold text-[color:var(--color-text-secondary)] enabled:hover:text-[color:var(--color-text)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Clear all
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterOpen(false)}
                    className="h-7 rounded-[6px] bg-[color:var(--color-brand-500)] px-3 text-[11px] font-semibold text-white hover:bg-[color:var(--color-brand-600)]"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Top metric summary row */}
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-[16px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3.5 shadow-[var(--shadow-card)]">
          <div className="flex items-start gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]" style={{ background: "#E6E9FB" }}>
              <UsersIcon size={16} style={{ color: "#2E47E0" }} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-[color:var(--color-text-secondary)]">Total in Pipeline</p>
              <p className="mt-0.5 text-[24px] font-extrabold leading-none text-[color:var(--color-text)]">{totalCount}</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-1 text-[10px] font-semibold text-[color:var(--color-success)]">
            <TrendUpIcon size={11} /> 12%
            <span className="font-normal text-[color:var(--color-text-muted)]">vs last week</span>
          </div>
        </div>

        <div className="rounded-[16px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3.5 shadow-[var(--shadow-card)]">
          <div className="flex items-start gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]" style={{ background: "#F2F3FD" }}>
              <TargetIcon size={16} style={{ color: "#5C6FE7" }} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-[color:var(--color-text-secondary)]">Active Candidates</p>
              <p className="mt-0.5 text-[24px] font-extrabold leading-none text-[color:var(--color-text)]">{activeCount}</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-1 text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-brand-500)]" />
            <span className="font-normal text-[color:var(--color-text-muted)]">In motion right now</span>
          </div>
        </div>

        <div className="rounded-[16px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3.5 shadow-[var(--shadow-card)]">
          <div className="flex items-start gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]" style={{ background: "#C4CBF6" }}>
              <SparklesIcon size={16} style={{ color: "#20319C" }} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-[color:var(--color-text-secondary)]">High Priority</p>
              <p className="mt-0.5 text-[24px] font-extrabold leading-none text-[color:var(--color-text)]">{highPriorityCount}</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-1 text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-error)]" />
            <span className="font-normal text-[color:var(--color-text-muted)]">Need attention today</span>
          </div>
        </div>

        <div className="rounded-[16px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3.5 shadow-[var(--shadow-card)]">
          <div className="flex items-start gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]" style={{ background: "#E6E9FB" }}>
              <TrophyIcon size={16} style={{ color: "#2E47E0" }} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-[color:var(--color-text-secondary)]">Placement Rate</p>
              <p className="mt-0.5 text-[24px] font-extrabold leading-none text-[color:var(--color-text)]">{conversionPct}%</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-1 text-[10px] font-semibold text-[color:var(--color-success)]">
            <TrendUpIcon size={11} /> 4%
            <span className="font-normal text-[color:var(--color-text-muted)]">conversion</span>
          </div>
        </div>
      </div>

      {/* Stage breadcrumb pills with arrows */}
      <div className="mb-1 -mx-2 overflow-x-auto px-2 pb-1 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[color:var(--color-border-strong)]">
        <div className="flex min-w-max items-center gap-2">
          {PIPELINE_STAGES.map((stage, i) => (
            <div key={stage.id} className="flex items-center gap-2">
              <StagePill
                stage={stage}
                count={grouped[stage.id].length}
                active={focus === stage.id}
                onClick={() => setFocus(focus === stage.id ? "all" : stage.id)}
              />
              {i < PIPELINE_STAGES.length - 1 ? <PillArrow /> : null}
            </div>
          ))}
        </div>
      </div>

      {/* Centered candidate count + owner avatars */}
      <div className="mb-4 mt-3 flex items-center gap-3">
        <span className="h-px flex-1 bg-[color:var(--color-border)]" />
        <span className="text-[12px] font-semibold text-[color:var(--color-text-secondary)]">
          {totalCount} Candidates in Pipeline
        </span>
        <span className="h-px flex-1 bg-[color:var(--color-border)]" />
        <div className="flex items-center gap-2">
          <span className="hidden text-[11px] text-[color:var(--color-text-muted)] md:inline">Owners:</span>
          <div className="flex -space-x-1.5">
            {pipelineOwners.slice(0, 5).map((o) => (
              <button
                key={o.initials}
                type="button"
                onClick={() => {
                  setOwnerFilters((prev) => {
                    const next = new Set(prev);
                    if (next.has(o.initials)) next.delete(o.initials);
                    else next.add(o.initials);
                    return next;
                  });
                }}
                title={`${o.name} · click to filter`}
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-[10px] font-bold text-white transition-transform hover:scale-110 ${
                  ownerFilters.has(o.initials)
                    ? "border-[color:var(--color-brand-500)]"
                    : "border-[color:var(--color-surface)]"
                }`}
                style={{ background: o.color }}
              >
                {o.initials}
              </button>
            ))}
            {pipelineOwners.length > 5 ? (
              <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[color:var(--color-surface)] bg-[color:var(--color-surface-2)] text-[10px] font-semibold text-[color:var(--color-text-secondary)]">
                +{pipelineOwners.length - 5}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 relative flex h-9 items-center rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 shadow-[var(--shadow-card)]">
        <SearchIcon size={14} className="text-[color:var(--color-text-muted)]" />
        <input
          type="text"
          placeholder="Search candidates, jobs, skills, owners…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="ml-2 flex-1 bg-transparent text-[13px] text-[color:var(--color-text)] outline-none placeholder:text-[color:var(--color-text-muted)]"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="text-[11px] font-semibold text-[color:var(--color-brand-500)] hover:text-[color:var(--color-brand-600)]"
          >
            Clear
          </button>
        )}
        <kbd className="ml-2 hidden rounded-[6px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-1.5 py-0.5 text-[10px] font-semibold text-[color:var(--color-text-muted)] sm:inline">
          ⌘ K
        </kbd>
      </div>

      {/* Board */}
      {view === "board" ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex min-w-fit gap-3">
            {visibleStages.map((stage) => {
              const stageCards = grouped[stage.id];
              const isDropTarget = dragOverStage === stage.id;
              return (
                <section
                  key={stage.id}
                  aria-label={stage.label}
                  onDragOver={(e) => handleColumnDragOver(e, stage.id)}
                  onDragLeave={() => { if (dragOverStage === stage.id) setDragOverStage(null); }}
                  onDrop={(e) => handleColumnDrop(e, stage.id)}
                  className={`flex w-[260px] shrink-0 flex-col rounded-[16px] p-2 transition-colors ${
                    isDropTarget
                      ? "bg-[color:var(--color-brand-50)] ring-2 ring-[color:var(--color-brand-300)] ring-offset-1 ring-offset-[color:var(--color-bg-base)]"
                      : "bg-[color:var(--color-surface-2)]/50"
                  }`}
                >
                  <ColumnHeader stage={stage} count={stageCards.length} description={stage.description} />

                  <div className="flex flex-col gap-2.5">
                    {addingTo === stage.id ? (
                      <AddCardForm
                        stage={stage}
                        onSubmit={(d) => addCard(stage.id, d)}
                        onCancel={() => setAddingTo(null)}
                      />
                    ) : null}

                    {stageCards.length === 0 && addingTo !== stage.id ? (
                      <EmptyColumn />
                    ) : (
                      stageCards.map((c) => (
                        <CandidateCard
                          key={c.id}
                          card={c}
                          stage={stage}
                          isDragging={draggingId === c.id}
                          menuOpen={menuCardId === c.id}
                          onToggleMenu={() => setMenuCardId(menuCardId === c.id ? null : c.id)}
                          onMove={(s) => moveCard(c.id, s)}
                          onDelete={() => deleteCard(c.id)}
                          onDragStart={(e) => handleDragStart(e, c.id)}
                          onDragEnd={handleDragEnd}
                        />
                      ))
                    )}

                    {addingTo !== stage.id ? (
                      <button
                        type="button"
                        onClick={() => setAddingTo(stage.id)}
                        className="group flex items-center justify-center gap-1.5 rounded-[12px] border border-dashed border-[color:var(--color-border-strong)] bg-[color:var(--color-surface)]/60 px-3 py-2.5 text-[11.5px] font-semibold text-[color:var(--color-text-muted)] transition-all hover:border-[color:var(--color-brand-300)] hover:bg-[color:var(--color-brand-50)] hover:text-[color:var(--color-brand-600)]"
                      >
                        <PlusIcon size={12} /> Add Candidate
                      </button>
                    ) : null}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      ) : (
        // List view
        <div className="overflow-hidden rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-card)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left">
              <thead>
                <tr className="border-b border-[color:var(--color-border)] text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
                  <th className="px-4 py-3">Candidate</th>
                  <th className="px-3 py-3">Role</th>
                  <th className="px-3 py-3">Stage</th>
                  <th className="px-3 py-3">Priority</th>
                  <th className="px-3 py-3 text-right">Score</th>
                  <th className="px-3 py-3">Next Step</th>
                  <th className="px-3 py-3">Owner</th>
                  <th className="px-3 py-3 text-right">Updated</th>
                  <th className="px-3 py-3 text-right" />
                </tr>
              </thead>
              <tbody>
                {visibleStages.flatMap((stage) =>
                  grouped[stage.id].map((c) => (
                    <tr key={c.id} className="border-b border-[color:var(--color-border)] last:border-0 text-[12px] hover:bg-[color:var(--color-surface-2)]/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: c.avatarColor }}>
                            {c.initials}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-[color:var(--color-text)]">{c.name}</p>
                            <p className="truncate text-[10px] text-[color:var(--color-text-muted)]">{c.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-[color:var(--color-text-secondary)]">{c.role}</td>
                      <td className="px-3 py-3">
                        <select
                          aria-label={`Move ${c.name} to stage`}
                          value={c.stage}
                          onChange={(e) => moveCard(c.id, e.target.value as PipelineStageId)}
                          className="cursor-pointer appearance-none rounded-full border-0 px-2 py-0.5 pr-5 text-[10px] font-semibold focus:outline-none focus:ring-2 focus:ring-[color:var(--color-brand-300)]"
                          style={{ background: stage.soft, color: stage.color }}
                        >
                          {PIPELINE_STAGES.map((s) => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-3"><PriorityChip p={c.priority} /></td>
                      <td className="px-3 py-3 text-right">
                        <div className="ml-auto flex items-center justify-end gap-1.5">
                          <div className="h-1 w-12 overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
                            <div className="h-full rounded-full" style={{ width: `${c.score}%`, background: stage.color }} />
                          </div>
                          <span className="text-[10px] font-bold text-[color:var(--color-text)]">{c.score}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-[color:var(--color-text-secondary)]">{c.nextStep}</td>
                      <td className="px-3 py-3">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: c.owner.color }}>
                            {c.owner.initials}
                          </span>
                          <span className="text-[color:var(--color-text-secondary)]">{c.owner.name.split(" ")[0]}</span>
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right text-[color:var(--color-text-muted)]">
                        <span className="inline-flex items-center gap-1">
                          <ClockIcon size={10} /> {c.updated}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <button
                          type="button"
                          aria-label={`Remove ${c.name}`}
                          onClick={() => deleteCard(c.id)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-error-light)] hover:text-[color:var(--color-error)]"
                        >
                          <XIcon size={12} />
                        </button>
                      </td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </div>
          {sortedCards.length === 0 && (
            <div className="flex flex-col items-center py-12">
              <UsersIcon size={32} className="text-[color:var(--color-text-muted)]" />
              <p className="mt-2 text-[13px] font-semibold text-[color:var(--color-text-secondary)]">No candidates match your filters</p>
            </div>
          )}
        </div>
      )}

      {/* Bottom analytics panel */}
      <div className="mt-6">
        <PipelineInsightsPanel totalCount={totalCount} grouped={grouped} />
      </div>
    </div>
  );
}
