"use client";

import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import {
  BuildingsIcon,
  CheckIcon,
  ChevronDown,
  ExternalLinkIcon,
  MoreIcon,
  PlusIcon,
  ProfileIcon,
  SearchIcon,
  SortIcon,
  TargetIcon,
  TrendUpIcon,
  TrophyIcon,
  UsersIcon,
  XIcon,
} from "@/components/icons/AppIcons";
import {
  OWNER_PIPELINE_STAGES,
  ownerPipelineCards as INITIAL_CARDS,
  ownerPipelineKpis,
  ownerPipelineOwners,
  ownerPipelineStrip,
  type OwnerPipelineCard,
  type OwnerPipelineStage,
  type OwnerPriority,
  type OwnerStageId,
  type Visa,
} from "@/lib/owner-pipeline-data";

/* ── Accent palette — mirrors the design exactly; neutrals/surfaces/brand come
   from the app's CSS tokens so the board stays theme-consistent. ──────────── */
const GREEN = "#16A34A";
const AMBER = "#D97706";

const CARD =
  "rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-card)]";

const VISA_STYLE: Record<Visa, { bg: string; fg: string }> = {
  H1B: { bg: "#FEF3C7", fg: "#92400E" },
  GC: { bg: "#DBEAFE", fg: "#1E40AF" },
  OPT: { bg: "#E0E7FF", fg: "#3730A3" },
};

const OWNER_COLOR: Record<string, string> = Object.fromEntries(
  ownerPipelineOwners.map((o) => [o.initials, o.color]),
);
const OWNER_NAME: Record<string, string> = Object.fromEntries(
  ownerPipelineOwners.map((o) => [o.initials, o.name]),
);

/* ── Sort / order ─────────────────────────────────────────────────────────── */
type SortKey = "default" | "score-desc" | "score-asc" | "priority" | "recent" | "name";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "default",    label: "Default order" },
  { key: "score-desc", label: "Score (high → low)" },
  { key: "score-asc",  label: "Score (low → high)" },
  { key: "priority",   label: "Priority (High first)" },
  { key: "recent",     label: "Most recent activity" },
  { key: "name",       label: "Name (A → Z)" },
];

const PRIORITY_RANK: Record<OwnerPriority, number> = { High: 0, Medium: 1, Low: 2 };

function parseRecency(updated: string): number {
  if (/just now/i.test(updated)) return 0;
  const m = updated.match(/(\d+)\s*(m|h|d|w)/i);
  if (!m) return 99999;
  const n = parseInt(m[1], 10);
  const unit = m[2].toLowerCase();
  if (unit === "m") return n;
  if (unit === "h") return n * 60;
  if (unit === "d") return n * 60 * 24;
  return n * 60 * 24 * 7;
}

function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  onClose: () => void,
  active: boolean,
) {
  useEffect(() => {
    if (!active) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [ref, onClose, active]);
}

/* ── Inline glyphs not in the shared icon set ─────────────────────────────── */
function WarningTriangle({ size = 18, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3.2 22 20H2L12 3.2Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 10v4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.6" fill={color} stroke={color} strokeWidth="0.8" />
    </svg>
  );
}

function PulseIcon({ size = 18, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 12h4l2.5-6 4 13 2.5-7H21"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── KPI cards (top row) ──────────────────────────────────────────────────── */
function KpiCard({
  label,
  value,
  valueColor,
  note,
  noteColor,
  icon,
  unit,
}: {
  label: string;
  value: string;
  valueColor?: string;
  note: React.ReactNode;
  noteColor?: string;
  icon: React.ReactNode;
  unit?: string;
}) {
  return (
    <div className={`${CARD} relative p-5`}>
      <span className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-[10px] bg-[color:var(--color-surface-2)] text-[color:var(--color-text-secondary)]">
        {icon}
      </span>
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[color:var(--color-text-muted)]">
        {label}
      </p>
      <p className="mt-3 flex items-baseline gap-2">
        <span
          className="text-[30px] font-extrabold leading-none tracking-tight"
          style={{ color: valueColor ?? "var(--color-text)" }}
        >
          {value}
        </span>
        {unit ? (
          <span className="text-[13px] font-medium text-[color:var(--color-text-secondary)]">{unit}</span>
        ) : null}
      </p>
      <p className="mt-2.5 text-[12.5px]" style={{ color: noteColor ?? "var(--color-text-muted)" }}>
        {note}
      </p>
    </div>
  );
}

function KpiRow() {
  const k = ownerPipelineKpis;
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="Open Pipeline"
        value={k.openPipeline.value}
        unit={k.openPipeline.unit}
        note={k.openPipeline.note}
        icon={<UsersIcon size={18} />}
      />
      <KpiCard
        label="Weighted Forecast"
        value={k.weightedForecast.value}
        valueColor={GREEN}
        note={k.weightedForecast.note}
        icon={<TrendUpIcon size={18} />}
      />
      <KpiCard
        label="Placed This Month"
        value={k.placedThisMonth.value}
        note={<span style={{ color: GREEN, fontWeight: 600 }}>{k.placedThisMonth.note}</span>}
        icon={<TrophyIcon size={18} />}
      />
      <KpiCard
        label="Win Rate"
        value={k.winRate.value}
        note={k.winRate.note}
        icon={<TargetIcon size={18} />}
      />
    </div>
  );
}

/* ── Secondary metric strip ───────────────────────────────────────────────── */
function StripSegment({
  icon,
  label,
  value,
  valueColor,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueColor?: string;
  note: string;
}) {
  return (
    <div className="flex items-center gap-3.5 p-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[color:var(--color-surface-2)] text-[color:var(--color-text-secondary)]">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[color:var(--color-text-muted)]">
          {label}
        </p>
        <p
          className="mt-1.5 text-[22px] font-extrabold leading-none tracking-tight"
          style={{ color: valueColor ?? "var(--color-text)" }}
        >
          {value}
        </p>
        <p className="mt-1.5 text-[12px] text-[color:var(--color-text-muted)]">{note}</p>
      </div>
    </div>
  );
}

function MetricStrip() {
  const s = ownerPipelineStrip;
  return (
    <div
      className={`${CARD} grid grid-cols-1 divide-y divide-[color:var(--color-border)] sm:grid-cols-3 sm:divide-x sm:divide-y-0`}
    >
      <StripSegment
        icon={<WarningTriangle size={18} color={AMBER} />}
        label="Bench Idle"
        value={s.benchIdle.value}
        valueColor={AMBER}
        note={s.benchIdle.note}
      />
      <StripSegment
        icon={<TrendUpIcon size={18} />}
        label="Conversion Rate"
        value={s.conversionRate.value}
        note={s.conversionRate.note}
      />
      <StripSegment
        icon={<PulseIcon size={18} color={AMBER} />}
        label="At-Risk"
        value={s.atRisk.value}
        valueColor={AMBER}
        note={s.atRisk.note}
      />
    </div>
  );
}

/* ── Toolbar ──────────────────────────────────────────────────────────────── */
function OwnerAvatarGroup() {
  const visible = ownerPipelineOwners.slice(0, 3);
  return (
    <div className="flex items-center">
      {visible.map((o, i) => (
        <span
          key={o.initials}
          className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white ring-2 ring-[color:var(--color-surface)] ${
            i > 0 ? "-ml-2" : ""
          }`}
          style={{ background: o.color }}
          title={o.name}
        >
          {o.initials}
        </span>
      ))}
      <button
        type="button"
        aria-label="Add recruiter filter"
        className="-ml-2 flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-[color:var(--color-border-strong)] bg-[color:var(--color-surface)] text-[color:var(--color-text-muted)] ring-2 ring-[color:var(--color-surface)] transition-colors hover:text-[color:var(--color-text)]"
      >
        <PlusIcon size={13} />
      </button>
    </div>
  );
}

function SortMenu({ sortKey, setSortKey }: { sortKey: SortKey; setSortKey: (k: SortKey) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);
  const active = SORT_OPTIONS.find((s) => s.key === sortKey) ?? SORT_OPTIONS[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex h-10 items-center gap-2 rounded-[12px] border bg-[color:var(--color-surface)] px-3.5 text-[13px] font-semibold transition-colors ${
          sortKey !== "default"
            ? "border-[color:var(--color-brand-300)] text-[color:var(--color-brand-600)]"
            : "border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)]"
        }`}
      >
        <SortIcon size={15} />
        <span className="hidden sm:inline">{active.label}</span>
        <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-30 mt-1.5 w-[224px] overflow-hidden rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] py-1 shadow-[var(--shadow-dropdown)]"
        >
          {SORT_OPTIONS.map((opt) => {
            const on = opt.key === sortKey;
            return (
              <button
                key={opt.key}
                type="button"
                role="menuitem"
                onClick={() => {
                  setSortKey(opt.key);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-3.5 py-2 text-left text-[13px] font-semibold transition-colors hover:bg-[color:var(--color-surface-2)] ${
                  on ? "text-[color:var(--color-brand-600)]" : "text-[color:var(--color-text)]"
                }`}
              >
                {opt.label}
                {on ? <CheckIcon size={14} className="text-[color:var(--color-brand-500)]" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function Toolbar({
  query,
  setQuery,
  sortKey,
  setSortKey,
}: {
  query: string;
  setQuery: (v: string) => void;
  sortKey: SortKey;
  setSortKey: (k: SortKey) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex h-10 min-w-[220px] flex-1 items-center rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 transition-shadow focus-within:border-[color:var(--color-brand-300)]">
        <SearchIcon size={15} className="text-[color:var(--color-text-muted)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search candidate, skill, client..."
          className="ml-2.5 flex-1 bg-transparent text-[13px] text-[color:var(--color-text)] outline-none placeholder:text-[color:var(--color-text-muted)]"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-secondary)]"
          >
            <XIcon size={13} />
          </button>
        ) : null}
      </div>

      <SortMenu sortKey={sortKey} setSortKey={setSortKey} />
      <OwnerAvatarGroup />
    </div>
  );
}

/* ── Candidate card ───────────────────────────────────────────────────────── */
function StageTileIcon({ stage, size = 18 }: { stage: OwnerPipelineStage; size?: number }) {
  if (stage.id === "submitted") return <BuildingsIcon size={size} style={{ color: stage.accent }} />;
  return <ProfileIcon size={size} style={{ color: stage.accent }} />;
}

function CandidateCard({
  card,
  stage,
  isDragging,
  onDragStart,
  onDragEnd,
}: {
  card: OwnerPipelineCard;
  stage: OwnerPipelineStage;
  isDragging: boolean;
  onDragStart: (e: DragEvent<HTMLElement>) => void;
  onDragEnd: () => void;
}) {
  const visa = VISA_STYLE[card.visa];
  const ownerColor = OWNER_COLOR[card.ownerInitials] ?? "var(--color-brand-500)";
  return (
    <article
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`group cursor-grab rounded-[14px] border bg-[color:var(--color-surface)] p-3.5 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,16,20,0.08)] active:cursor-grabbing motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
        isDragging
          ? "rotate-[1deg] scale-[1.01] border-[color:var(--color-brand-300)] opacity-85 shadow-[var(--shadow-panel)]"
          : "border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
          style={{ background: stage.soft }}
        >
          <StageTileIcon stage={stage} size={17} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold leading-snug text-[color:var(--color-text)]">
            {card.name}
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
            <span className="text-[12px] text-[color:var(--color-text-secondary)]">{card.role}</span>
            <span
              className="inline-flex items-center rounded-[6px] px-1.5 py-0.5 text-[10px] font-bold"
              style={{ background: visa.bg, color: visa.fg }}
            >
              {card.visa}
            </span>
          </div>
          <p className="mt-1.5 truncate text-[12px] text-[color:var(--color-text-secondary)]">
            <span className="text-[color:var(--color-text-muted)]">&rarr;</span> {card.client}
            <span className="mx-1 text-[color:var(--color-text-muted)]">&bull;</span>
            <span className="font-semibold text-[color:var(--color-text)]">{card.rate}</span>
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9.5px] font-bold text-white ring-2 ring-[color:var(--color-surface)]"
          style={{ background: ownerColor }}
          title={`Owner: ${OWNER_NAME[card.ownerInitials] ?? card.ownerInitials}`}
        >
          {card.ownerInitials}
        </span>
        {card.placedAgo ? (
          <span className="text-[11px] font-semibold" style={{ color: GREEN }}>
            {card.placedAgo}
          </span>
        ) : (
          <span className="text-[11px] text-[color:var(--color-text-muted)]">{card.updated}</span>
        )}
      </div>
    </article>
  );
}

/* ── Column header ────────────────────────────────────────────────────────── */
function ColumnHeader({ stage, count }: { stage: OwnerPipelineStage; count: number }) {
  return (
    <div className="mb-3 flex items-center gap-2 px-1 pt-1">
      <span aria-hidden className="h-2 w-2 shrink-0 rounded-full" style={{ background: stage.accent }} />
      <span className="truncate text-[12px] font-bold uppercase tracking-[0.04em] text-[color:var(--color-text)]">
        {stage.label}
      </span>
      <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[color:var(--color-surface-2)] px-1 text-[11px] font-bold tabular-nums text-[color:var(--color-text-secondary)]">
        {count}
      </span>
      <span className="ml-auto text-[12px] font-bold tabular-nums" style={{ color: GREEN }}>
        {stage.forecast}
      </span>
      <button
        type="button"
        aria-label={`More ${stage.label} options`}
        className="flex h-6 w-6 items-center justify-center rounded-[6px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface)] hover:text-[color:var(--color-text)]"
      >
        <MoreIcon size={14} />
      </button>
    </div>
  );
}

/* ── Owner pipeline board ─────────────────────────────────────────────────── */
export function OwnerPipelineBoard() {
  const [cards, setCards] = useState<OwnerPipelineCard[]>(INITIAL_CARDS);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("default");

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<OwnerStageId | null>(null);

  const filteredCards = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cards.filter((c) => {
      if (!q) return true;
      return `${c.name} ${c.role} ${c.client} ${c.ownerInitials}`.toLowerCase().includes(q);
    });
  }, [cards, query]);

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
    const by: Record<OwnerStageId, OwnerPipelineCard[]> = {
      new: [], submitted: [], interview: [], offered: [], placed: [],
    };
    for (const c of sortedCards) by[c.stage].push(c);
    return by;
  }, [sortedCards]);

  function moveCard(cardId: string, toStage: OwnerStageId) {
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId
          ? { ...c, stage: toStage, updated: "just now", placedAgo: toStage === "placed" ? "Placed just now" : undefined }
          : c,
      ),
    );
  }

  function handleDragStart(e: DragEvent<HTMLElement>, cardId: string) {
    setDraggingId(cardId);
    e.dataTransfer.effectAllowed = "move";
    try {
      e.dataTransfer.setData("text/plain", cardId);
    } catch {
      /* ignore */
    }
  }
  function handleDragEnd() {
    setDraggingId(null);
    setDragOverStage(null);
  }
  function handleColumnDragOver(e: DragEvent<HTMLElement>, stageId: OwnerStageId) {
    if (!draggingId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverStage !== stageId) setDragOverStage(stageId);
  }
  function handleColumnDrop(e: DragEvent<HTMLElement>, stageId: OwnerStageId) {
    e.preventDefault();
    const cardId = draggingId ?? e.dataTransfer.getData("text/plain");
    if (cardId) {
      const card = cards.find((c) => c.id === cardId);
      if (card && card.stage !== stageId) moveCard(cardId, stageId);
    }
    setDraggingId(null);
    setDragOverStage(null);
  }

  return (
    <div className="min-h-full bg-[color:var(--color-bg-base)] px-4 py-6 sm:px-6 xl:px-8">
      {/* Header */}
      <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-[color:var(--color-text)] sm:text-[28px]">
            Pipeline
          </h1>
          <p className="mt-1 max-w-[640px] text-[13px] text-[color:var(--color-text-secondary)]">
            Drag candidates between stages — every move logs to the timeline. Agency-wide across all
            recruiters.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 text-[13px] font-semibold text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-surface-2)]"
          >
            <ExternalLinkIcon size={16} />
            Export
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-[12px] bg-[color:var(--color-brand-500)] px-4 text-[13px] font-semibold text-white shadow-[0_4px_14px_rgba(91,61,245,0.30)] transition-colors hover:bg-[color:var(--color-brand-600)]"
          >
            <PlusIcon size={16} />
            Add Candidate
          </button>
        </div>
      </header>

      {/* KPI cards */}
      <div className="mb-5">
        <KpiRow />
      </div>

      {/* Secondary metric strip */}
      <div className="mb-5">
        <MetricStrip />
      </div>

      {/* Toolbar */}
      <div className="mb-5">
        <Toolbar query={query} setQuery={setQuery} sortKey={sortKey} setSortKey={setSortKey} />
      </div>

      {/* Board */}
      <div className="overflow-x-auto pb-4">
        <div
          className="grid min-w-fit gap-4"
          style={{ gridTemplateColumns: `repeat(${OWNER_PIPELINE_STAGES.length}, minmax(264px, 1fr))` }}
        >
          {OWNER_PIPELINE_STAGES.map((stage) => {
            const stageCards = grouped[stage.id];
            const isDropTarget = dragOverStage === stage.id;
            return (
              <section
                key={stage.id}
                aria-label={stage.label}
                onDragOver={(e) => handleColumnDragOver(e, stage.id)}
                onDragLeave={() => {
                  if (dragOverStage === stage.id) setDragOverStage(null);
                }}
                onDrop={(e) => handleColumnDrop(e, stage.id)}
                className={`flex shrink-0 flex-col rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/50 p-3 transition-all duration-200 motion-reduce:transition-none ${
                  isDropTarget ? "ring-2 ring-[color:var(--color-brand-300)]/60" : ""
                }`}
              >
                <ColumnHeader stage={stage} count={stageCards.length} />

                <div className="flex flex-col gap-2.5">
                  {stageCards.map((c) => (
                    <CandidateCard
                      key={c.id}
                      card={c}
                      stage={stage}
                      isDragging={draggingId === c.id}
                      onDragStart={(e) => handleDragStart(e, c.id)}
                      onDragEnd={handleDragEnd}
                    />
                  ))}

                  <button
                    type="button"
                    className="flex items-center justify-center gap-1.5 rounded-[12px] border border-dashed border-[color:var(--color-border-strong)]/70 bg-[color:var(--color-surface)]/60 px-3 py-2.5 text-[12px] font-semibold text-[color:var(--color-text-muted)] transition-all hover:bg-[color:var(--color-surface)] hover:text-[color:var(--color-text-secondary)]"
                  >
                    <PlusIcon size={13} /> Add Card
                  </button>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
