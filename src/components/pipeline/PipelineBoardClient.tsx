"use client";

import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import {
  BookmarkIcon,
  CheckIcon,
  ChevronDown,
  ClockIcon,
  FilterIcon,
  MoreIcon,
  PinIcon,
  PlusIcon,
  SearchIcon,
  SortIcon,
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

// Pastel category colors per stage (used for tag chip on each card + column accent)
const PASTEL_BY_STAGE: Record<PipelineStageId, { tagBg: string; tagFg: string; columnBg: string; dot: string }> = {
  new:         { tagBg: "#FCE7F3", tagFg: "#9D174D", columnBg: "#FDF2F8", dot: "#EC4899" },
  shortlisted: { tagBg: "#FCE7F3", tagFg: "#9D174D", columnBg: "#FDF2F8", dot: "#EC4899" },
  submitted:   { tagBg: "#DBEAFE", tagFg: "#1E40AF", columnBg: "#EFF6FF", dot: "#3B82F6" },
  interview:   { tagBg: "#FEF3C7", tagFg: "#92400E", columnBg: "#FFFBEB", dot: "#F59E0B" },
  offered:     { tagBg: "#EDE9FE", tagFg: "#5B21B6", columnBg: "#F5F3FF", dot: "#8B5CF6" },
  placed:      { tagBg: "#D1FAE5", tagFg: "#065F46", columnBg: "#ECFDF5", dot: "#10B981" },
  rejected:    { tagBg: "#F3F4F6", tagFg: "#4B5563", columnBg: "#F9FAFB", dot: "#9CA3AF" },
};

// Only show these 4 stages on the board
const VISIBLE_STAGE_IDS: PipelineStageId[] = ["shortlisted", "submitted", "interview", "offered"];

// Recent activity feed — owners involved in the pipeline
type ActivityEntry = {
  id: string;
  ownerInitials: string;
  ownerName: string;
  ownerColor: string;
  action: string;
  target: string;
  time: string;
};

const RECENT_ACTIVITY: ActivityEntry[] = [
  { id: "a1", ownerInitials: "ER", ownerName: "Emma Rodriguez", ownerColor: "#EC4899", action: "moved",     target: "Ralph Edwards to Interview", time: "2h ago"  },
  { id: "a2", ownerInitials: "SP", ownerName: "Sophia Patel",   ownerColor: "#3B82F6", action: "submitted", target: "Cameron Williamson to Acme", time: "4h ago"  },
  { id: "a3", ownerInitials: "LC", ownerName: "Liam Chen",      ownerColor: "#F59E0B", action: "scheduled", target: "Wade Warren — technical round", time: "5h ago"  },
  { id: "a4", ownerInitials: "OB", ownerName: "Olivia Brown",   ownerColor: "#8B5CF6", action: "added",     target: "note on Esther Howard",       time: "Yesterday" },
  { id: "a5", ownerInitials: "NK", ownerName: "Noah Kim",       ownerColor: "#10B981", action: "shortlisted", target: "Leslie Alexander",          time: "Yesterday" },
];

// Day-budget per stage. Cards aging beyond this are "at risk".
const STAGE_BUDGET_DAYS: Record<PipelineStageId, number> = {
  new: 2, shortlisted: 3, submitted: 4, interview: 5, offered: 3, placed: 2, rejected: 0,
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

function ageInStageDays(s: string): number {
  const m = s.match(/(\d+)\s*(d|w|h)/i);
  if (!m) return 0;
  const n = parseInt(m[1], 10);
  const unit = m[2].toLowerCase();
  if (unit === "h") return n / 24;
  if (unit === "w") return n * 7;
  return n;
}

function uid() {
  return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

const STAGE_AVATAR_COLORS = ["#2E47E0", "#525252", "#5C6FE7", "#20319C"];

function pickAvatarColor() {
  return STAGE_AVATAR_COLORS[Math.floor(Math.random() * STAGE_AVATAR_COLORS.length)];
}

function nameToInitials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase() ?? "").join("");
}

function useClickOutside(ref: React.RefObject<HTMLElement | null>, onClose: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [ref, onClose, active]);
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
  const pastel = PASTEL_BY_STAGE[card.stage];
  const ageDays = ageInStageDays(card.ageInStage);
  const overBudget = ageDays > STAGE_BUDGET_DAYS[card.stage];

  return (
    <article
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`group relative cursor-grab overflow-hidden rounded-[16px] border bg-[color:var(--color-surface)] p-3.5 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,16,20,0.08)] active:cursor-grabbing motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
        isDragging
          ? "rotate-[1deg] scale-[1.01] border-[color:var(--color-brand-300)] opacity-85 shadow-[var(--shadow-panel)]"
          : "border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)]"
      }`}
    >
      {/* Stage tag + more menu */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <span
          className="inline-flex items-center rounded-[8px] px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide"
          style={{ background: pastel.tagBg, color: pastel.tagFg }}
        >
          {stage.label}
        </span>
        <button
          type="button"
          aria-label="Card actions"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={(e) => { e.stopPropagation(); onToggleMenu(); }}
          className="rounded-[6px] p-0.5 text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)] sm:opacity-0 sm:group-hover:opacity-100"
        >
          <MoreIcon size={14} />
        </button>
        {menuOpen ? (
          <CardMoreMenu card={card} onClose={onToggleMenu} onMove={onMove} onDelete={onDelete} />
        ) : null}
      </div>

      {/* Title — candidate name + role */}
      <div className="mb-3.5">
        <p className="text-[14px] font-bold leading-snug text-[color:var(--color-text)]">
          {card.name}
        </p>
        <p className="mt-1 text-[12px] leading-snug text-[color:var(--color-text-secondary)]">
          {card.role}
        </p>
      </div>

      {/* Match score — slim, tinted with pastel */}
      <div className="mb-3 flex items-center gap-2">
        <div className="h-1 flex-1 overflow-hidden rounded-full" style={{ background: pastel.tagBg }}>
          <div
            className="h-full rounded-full transition-[width] duration-700 ease-out motion-reduce:transition-none"
            style={{ width: `${card.score}%`, background: pastel.dot }}
          />
        </div>
        <span className="shrink-0 text-[10.5px] font-bold tabular-nums" style={{ color: pastel.tagFg }}>
          {card.score}%
        </span>
      </div>

      {/* Footer: meta + owner avatar */}
      <div className="flex items-center justify-between gap-2 border-t border-[color:var(--color-border)] pt-2.5">
        <div className="flex items-center gap-2.5 text-[10.5px] text-[color:var(--color-text-muted)]">
          <span
            className="inline-flex items-center gap-1"
            style={overBudget ? { color: "#DC2626", fontWeight: 600 } : undefined}
          >
            <ClockIcon size={11} />
            {card.ageInStage}
          </span>
          {card.tags[0] ? (
            <span className="inline-flex items-center gap-1">
              <BookmarkIcon size={11} />
              {card.tags.length}
            </span>
          ) : null}
          {card.location && card.location !== "—" ? (
            <span className="inline-flex items-center gap-1 truncate">
              <PinIcon size={11} />
              <span className="truncate">{card.location.split(",")[0]}</span>
            </span>
          ) : null}
        </div>
        <div
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9.5px] font-bold text-white ring-2 ring-[color:var(--color-surface)]"
          style={{ background: card.owner.color }}
          title={`Owner: ${card.owner.name}`}
        >
          {card.owner.initials}
        </div>
      </div>
    </article>
  );
}

// ─── Column header ────────────────────────────────────────────────────────────

function ColumnHeader({
  stage, count,
}: { stage: PipelineStage; count: number; description: string }) {
  const pastel = PASTEL_BY_STAGE[stage.id];
  return (
    <div className="mb-3 flex items-center justify-between gap-2 px-1 pt-1">
      <div className="flex min-w-0 items-center gap-2">
        <span
          aria-hidden
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ background: pastel.dot }}
        />
        <span className="truncate text-[13px] font-bold text-[color:var(--color-text)]">{stage.label}</span>
        <span className="text-[12px] font-medium tabular-nums text-[color:var(--color-text-muted)]">
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

// ─── Empty column ─────────────────────────────────────────────────────────────

function EmptyColumn() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[12px] border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-surface)]/40 px-4 py-8 text-center">
      <UsersIcon size={20} className="text-[color:var(--color-text-muted)]" />
      <p className="mt-2 text-[11px] font-semibold text-[color:var(--color-text-secondary)]">No candidates yet</p>
      <p className="mt-0.5 text-[10px] text-[color:var(--color-text-muted)]">Drag a card here or add one</p>
    </div>
  );
}

// ─── Right sidebar — Stage Progress ──────────────────────────────────────────

function StageProgressList({
  grouped, totalCount,
}: {
  grouped: Record<PipelineStageId, PipelineCard[]>;
  totalCount: number;
}) {
  return (
    <section>
      <header className="mb-4 flex items-center justify-between">
        <h3 className="text-[14px] font-bold text-[color:var(--color-text)]">Stage Progress</h3>
        <button
          type="button"
          className="text-[11px] font-semibold text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-secondary)]"
        >
          This week
        </button>
      </header>
      <ul className="space-y-4">
        {VISIBLE_STAGE_IDS.map((id) => {
          const stage = PIPELINE_STAGES.find((s) => s.id === id);
          if (!stage) return null;
          const pastel = PASTEL_BY_STAGE[id];
          const count = grouped[id].length;
          const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
          return (
            <li key={id}>
              <div className="mb-1.5 flex items-center justify-between gap-2 text-[12px]">
                <span className="font-semibold text-[color:var(--color-text)]">
                  {stage.label}
                </span>
                <span className="tabular-nums text-[color:var(--color-text-muted)]">
                  {count}/{totalCount}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full" style={{ background: pastel.tagBg }}>
                <div
                  className="h-full rounded-full transition-[width] duration-700 ease-out motion-reduce:transition-none"
                  style={{ width: `${pct}%`, background: pastel.dot }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ─── Right sidebar — Recent Activity ────────────────────────────────────────

function RecentActivityFeed() {
  return (
    <section>
      <header className="mb-4 flex items-center justify-between">
        <h3 className="text-[14px] font-bold text-[color:var(--color-text)]">Recent Activity</h3>
        <button
          type="button"
          className="text-[11px] font-semibold text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-secondary)]"
        >
          See all
        </button>
      </header>
      <ul className="space-y-3">
        {RECENT_ACTIVITY.map((a) => (
          <li key={a.id} className="flex items-start gap-2.5">
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ background: a.ownerColor }}
            >
              {a.ownerInitials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] leading-snug text-[color:var(--color-text)]">
                <span className="font-semibold">{a.ownerName.split(" ")[0]}</span>
                <span className="text-[color:var(--color-text-secondary)]"> {a.action} </span>
                <span className="text-[color:var(--color-text-secondary)]">{a.target}</span>
              </p>
              <p className="mt-0.5 text-[10.5px] text-[color:var(--color-text-muted)]">{a.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ─── Right sidebar — Active people on this pipeline ─────────────────────────

function ActivePeopleStrip({
  grouped,
}: {
  grouped: Record<PipelineStageId, PipelineCard[]>;
}) {
  // Count how many active candidates each owner has across the visible stages
  const counts = new Map<string, { name: string; color: string; count: number }>();
  for (const id of VISIBLE_STAGE_IDS) {
    for (const c of grouped[id]) {
      const existing = counts.get(c.owner.initials);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(c.owner.initials, {
          name: c.owner.name,
          color: c.owner.color,
          count: 1,
        });
      }
    }
  }
  const owners = Array.from(counts.entries())
    .map(([initials, v]) => ({ initials, ...v }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <section>
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-[14px] font-bold text-[color:var(--color-text)]">Active People</h3>
        <span className="text-[11px] text-[color:var(--color-text-muted)]">{owners.length}</span>
      </header>
      <ul className="space-y-2">
        {owners.map((o) => (
          <li key={o.initials} className="flex items-center gap-2.5">
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ background: o.color }}
            >
              {o.initials}
            </span>
            <span className="flex-1 truncate text-[12px] font-medium text-[color:var(--color-text)]">
              {o.name}
            </span>
            <span className="rounded-full bg-[color:var(--color-surface-2)] px-2 py-0.5 text-[10.5px] font-bold tabular-nums text-[color:var(--color-text-secondary)]">
              {o.count}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ─── Main Pipeline Board ──────────────────────────────────────────────────────

export function PipelineBoardClient() {
  const [cards, setCards] = useState<PipelineCard[]>(INITIAL_CARDS);
  const [query, setQuery] = useState("");
  const [focus] = useState<PipelineStageId | "all">("all");

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

  // ── Mutations ────────────────────────────────────────────────────────────
  function moveCard(cardId: string, toStage: PipelineStageId) {
    setCards((prev) =>
      prev.map((c) => c.id === cardId ? { ...c, stage: toStage, ageInStage: "just now", updated: "just now" } : c),
    );
  }
  function deleteCard(cardId: string) { setCards((prev) => prev.filter((c) => c.id !== cardId)); }
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

  // ── Filter / sort / group ───────────────────────────────────────────────
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
  const fourStages = PIPELINE_STAGES.filter((s) => VISIBLE_STAGE_IDS.includes(s.id));
  const visibleStages = focus === "all" ? fourStages : fourStages.filter((s) => s.id === focus);

  const activeFilterCount = priorityFilters.size + ownerFilters.size;

  // ── Keyboard shortcut: ⌘/Ctrl+K focuses search ──────────────────────────
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ── DnD ─────────────────────────────────────────────────────────────────
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

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-full bg-[color:var(--color-bg-base)] px-4 py-6 sm:px-6 xl:px-8">
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-[color:var(--color-text)] sm:text-[28px]">
            Pipeline
          </h1>
          <p className="mt-1 text-[13px] text-[color:var(--color-text-secondary)]">
            {totalCount} candidates moving through {VISIBLE_STAGE_IDS.length} stages
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative flex h-9 w-[200px] items-center rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-2.5 transition-shadow focus-within:border-[color:var(--color-brand-300)] focus-within:shadow-[var(--shadow-card-hover)] sm:w-[240px]">
            <SearchIcon size={13} className="text-[color:var(--color-text-muted)]" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search this board…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="ml-2 flex-1 bg-transparent text-[12.5px] text-[color:var(--color-text)] outline-none placeholder:text-[color:var(--color-text-muted)]"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-secondary)]"
              >
                <XIcon size={12} />
              </button>
            ) : null}
          </div>

          {/* Sort */}
          <div className="relative" ref={sortRef}>
            <button
              type="button"
              onClick={() => setSortOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={sortOpen}
              className={`flex h-9 items-center gap-1.5 rounded-[10px] border bg-[color:var(--color-surface)] px-2.5 text-[12px] font-medium transition-colors ${
                sortKey !== "default"
                  ? "border-[color:var(--color-brand-300)] text-[color:var(--color-brand-600)]"
                  : "border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)]"
              }`}
            >
              <SortIcon size={13} />
              <span className="hidden md:inline">{SORT_OPTIONS.find((s) => s.key === sortKey)?.label ?? "Sort"}</span>
              <ChevronDown size={11} className={`transition-transform ${sortOpen ? "rotate-180" : ""}`} />
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
              className={`flex h-9 items-center gap-1.5 rounded-[10px] border bg-[color:var(--color-surface)] px-2.5 text-[12px] font-medium transition-colors ${
                activeFilterCount > 0
                  ? "border-[color:var(--color-brand-300)] text-[color:var(--color-brand-600)]"
                  : "border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)]"
              }`}
            >
              <FilterIcon size={13} />
              <span className="hidden md:inline">Filter</span>
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
      </header>

      {/* ── Main grid: kanban + sidebar ──────────────────────── */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        {/* Kanban */}
        <div className="overflow-x-auto pb-4">
          <div
            className="grid min-w-fit gap-4"
            style={{ gridTemplateColumns: `repeat(${visibleStages.length}, minmax(252px, 1fr))` }}
          >
            {visibleStages.map((stage) => {
              const stageCards = grouped[stage.id];
              const isDropTarget = dragOverStage === stage.id;
              const pastel = PASTEL_BY_STAGE[stage.id];
              return (
                <section
                  key={stage.id}
                  aria-label={stage.label}
                  onDragOver={(e) => handleColumnDragOver(e, stage.id)}
                  onDragLeave={() => { if (dragOverStage === stage.id) setDragOverStage(null); }}
                  onDrop={(e) => handleColumnDrop(e, stage.id)}
                  className={`flex shrink-0 flex-col rounded-[18px] p-3 transition-all duration-200 motion-reduce:transition-none ${
                    isDropTarget ? "ring-2 ring-[color:var(--color-brand-300)]/60" : ""
                  }`}
                  style={{ background: pastel.columnBg }}
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
                        className="flex items-center justify-center gap-1.5 rounded-[12px] border border-dashed border-[color:var(--color-border-strong)]/70 bg-[color:var(--color-surface)]/60 px-3 py-2.5 text-[11.5px] font-semibold text-[color:var(--color-text-muted)] transition-all hover:bg-[color:var(--color-surface)] hover:text-[color:var(--color-text-secondary)]"
                      >
                        <PlusIcon size={12} /> Add Card
                      </button>
                    ) : null}
                  </div>
                </section>
              );
            })}
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="space-y-6 self-start rounded-[20px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <StageProgressList grouped={grouped} totalCount={totalCount} />
          <div className="border-t border-[color:var(--color-border)] pt-5">
            <ActivePeopleStrip grouped={grouped} />
          </div>
          <div className="border-t border-[color:var(--color-border)] pt-5">
            <RecentActivityFeed />
          </div>
        </aside>
      </div>
    </div>
  );
}
