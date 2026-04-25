"use client";

import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import {
  CheckIcon,
  ChevronDown,
  ChevronRight,
  ClockIcon,
  FilterIcon,
  GridViewIcon,
  ListViewIcon,
  MoreIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  SortIcon,
  TargetIcon,
  TrendUpIcon,
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
  High:   { bg: "#FDECEC", fg: "#DC2626", dot: "#EF4444" },
  Medium: { bg: "#FFF4DB", fg: "#B45309", dot: "#F59E0B" },
  Low:    { bg: "#EAFBF1", fg: "#16A34A", dot: "#22C55E" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseRecency(updated: string): number {
  // returns minutes since update — lower = more recent
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

const STAGE_AVATAR_COLORS = ["#5B3DF5", "#3B82F6", "#22C55E", "#F59E0B", "#EC4899", "#06B6D4"];

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

// ─── Tiny popup helper ────────────────────────────────────────────────────────

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

// ─── Score mini-bar ───────────────────────────────────────────────────────────

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-1 w-12 overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-[10px] font-bold text-[color:var(--color-text)]">{value}</span>
    </div>
  );
}

// ─── Card More menu ───────────────────────────────────────────────────────────

function CardMoreMenu({
  card,
  onClose,
  onMove,
  onDelete,
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
              onClick={() => {
                if (!isCurrent) onMove(s.id);
                onClose();
              }}
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
  card,
  stage,
  isDragging,
  menuOpen,
  onToggleMenu,
  onMove,
  onDelete,
  onDragStart,
  onDragEnd,
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
  return (
    <article
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`group relative cursor-grab rounded-[12px] border bg-[color:var(--color-surface)] p-3 shadow-[0_1px_2px_rgba(23,26,43,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] active:cursor-grabbing ${
        isDragging
          ? "border-[color:var(--color-brand-500)] opacity-50"
          : "border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)]"
      }`}
    >
      {/* Left color accent */}
      <span
        aria-hidden
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-[3px]"
        style={{ background: stage.color }}
      />

      {/* Header row */}
      <div className="mb-2 flex items-start gap-2.5 pl-1.5">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
          style={{ background: card.avatarColor }}
        >
          {card.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12.5px] font-semibold text-[color:var(--color-text)]">
            {card.name}
          </p>
          <p className="truncate text-[11px] text-[color:var(--color-text-secondary)]">
            {card.role}
          </p>
        </div>
        <button
          type="button"
          aria-label="Card actions"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={(e) => {
            e.stopPropagation();
            onToggleMenu();
          }}
          className="rounded-[6px] p-1 text-[color:var(--color-text-muted)] opacity-100 transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)] sm:opacity-0 sm:group-hover:opacity-100"
        >
          <MoreIcon size={14} />
        </button>
        {menuOpen ? (
          <CardMoreMenu
            card={card}
            onClose={onToggleMenu}
            onMove={onMove}
            onDelete={onDelete}
          />
        ) : null}
      </div>

      {/* Meta row — priority + score */}
      <div className="mb-2 flex items-center justify-between gap-2 pl-1.5">
        <PriorityChip p={card.priority} />
        <ScoreBar value={card.score} color={stage.color} />
      </div>

      {/* Tags */}
      {card.tags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1 pl-1.5">
          {card.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-md bg-[color:var(--color-surface-2)] px-1.5 py-0.5 text-[10px] font-medium text-[color:var(--color-text-secondary)]"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Next step banner */}
      <div
        className="mb-2 rounded-[8px] px-2 py-1.5 pl-3"
        style={{ background: `${stage.color}0F`, borderLeft: `2px solid ${stage.color}` }}
      >
        <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: stage.color }}>
          Next step
        </p>
        <p className="mt-0.5 text-[11px] font-medium text-[color:var(--color-text)]">
          {card.nextStep}
        </p>
      </div>

      {/* Footer — owner + time */}
      <div className="flex items-center justify-between gap-2 pl-1.5 text-[10px] text-[color:var(--color-text-muted)]">
        <div className="flex items-center gap-1.5">
          <span
            className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white"
            style={{ background: card.owner.color }}
            title={`Owner: ${card.owner.name}`}
          >
            {card.owner.initials}
          </span>
          <span className="text-[10px] font-medium text-[color:var(--color-text-secondary)]">
            {card.owner.name.split(" ")[0]}
          </span>
        </div>
        <span className="inline-flex items-center gap-1">
          <ClockIcon size={10} />
          {card.ageInStage} in stage
        </span>
      </div>
    </article>
  );
}

// ─── Column header ────────────────────────────────────────────────────────────

function ColumnHeader({
  stage,
  count,
  onAdd,
}: {
  stage: PipelineStage;
  count: number;
  onAdd: () => void;
}) {
  return (
    <div className="mb-3 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-2.5 py-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            aria-hidden
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: stage.color }}
          />
          <span className="truncate text-[12px] font-bold text-[color:var(--color-text)]">
            {stage.label}
          </span>
          <span
            className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold tabular-nums"
            style={{ background: stage.soft, color: stage.color }}
          >
            {count}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onAdd}
            aria-label={`Add candidate to ${stage.label}`}
            className="flex h-6 w-6 items-center justify-center rounded-[6px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-brand-500)]"
          >
            <PlusIcon size={13} />
          </button>
        </div>
      </div>
      <p className="mt-1 truncate text-[10px] text-[color:var(--color-text-muted)]">
        {stage.description}
      </p>
    </div>
  );
}

// ─── Inline Add Card form ─────────────────────────────────────────────────────

function AddCardForm({
  stage,
  onSubmit,
  onCancel,
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
      className="rounded-[12px] border bg-[color:var(--color-surface)] p-3 shadow-[var(--shadow-card)]"
      style={{ borderColor: stage.color }}
    >
      <input
        autoFocus
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
          if (e.key === "Escape") onCancel();
        }}
        placeholder="Candidate name"
        className="mb-2 h-8 w-full rounded-[8px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-base)] px-2.5 text-[12.5px] font-semibold text-[color:var(--color-text)] outline-none placeholder:font-normal placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-brand-500)]"
      />
      <input
        type="text"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
          if (e.key === "Escape") onCancel();
        }}
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
          className="h-7 rounded-[6px] bg-[color:var(--color-brand-500)] px-3 text-[11px] font-semibold text-white shadow-[0_2px_8px_rgba(91,61,245,0.3)] transition-all enabled:hover:bg-[color:var(--color-brand-600)] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          Add card
        </button>
      </div>
    </div>
  );
}

// ─── Stage filter pill ────────────────────────────────────────────────────────

function StageMetric({
  stage,
  count,
  active,
  onClick,
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
      className={`group flex shrink-0 items-center gap-2.5 rounded-full border px-3 py-2 text-left transition-all ${
        active
          ? "border-transparent bg-[color:var(--color-surface)] shadow-[var(--shadow-card)]"
          : "border-[color:var(--color-border)] bg-[color:var(--color-surface)] hover:bg-[color:var(--color-surface-2)]"
      }`}
      style={active ? { boxShadow: `0 0 0 1.5px ${stage.color}, var(--shadow-card)` } : undefined}
    >
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: stage.color }} />
      <span className={`text-[12px] font-semibold ${active ? "text-[color:var(--color-text)]" : "text-[color:var(--color-text-secondary)]"}`}>
        {stage.label}
      </span>
      <span
        className="inline-flex h-5 min-w-[22px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold tabular-nums"
        style={{ background: stage.soft, color: stage.color }}
      >
        {count}
      </span>
    </button>
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

  // Sort & Filter
  const [sortKey, setSortKey] = useState<SortKey>("default");
  const [sortOpen, setSortOpen] = useState(false);
  const [priorityFilters, setPriorityFilters] = useState<Set<PipelinePriority>>(new Set());
  const [ownerFilters, setOwnerFilters] = useState<Set<string>>(new Set());
  const [filterOpen, setFilterOpen] = useState(false);

  // DnD
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<PipelineStageId | null>(null);

  // UI: which card menu / which inline form is open
  const [menuCardId, setMenuCardId] = useState<string | null>(null);
  const [addingTo, setAddingTo] = useState<PipelineStageId | null>(null);

  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  useClickOutside(sortRef, () => setSortOpen(false), sortOpen);
  useClickOutside(filterRef, () => setFilterOpen(false), filterOpen);

  // ─── Mutations ──────────────────────────────────────────────────────────────
  function moveCard(cardId: string, toStage: PipelineStageId) {
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId ? { ...c, stage: toStage, ageInStage: "just now", updated: "just now" } : c,
      ),
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

  // ─── Filtering, sorting, grouping ───────────────────────────────────────────
  const filteredCards = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cards.filter((c) => {
      if (q && !`${c.name} ${c.role} ${c.tags.join(" ")} ${c.owner.name}`.toLowerCase().includes(q)) {
        return false;
      }
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
  const visibleStages = focus === "all"
    ? PIPELINE_STAGES
    : PIPELINE_STAGES.filter((s) => s.id === focus);

  // Metrics
  const activeCount = cards.filter((c) => c.stage !== "placed" && c.stage !== "rejected").length;
  const highPriorityCount = cards.filter((c) => c.priority === "High").length;
  const placedCount = cards.filter((c) => c.stage === "placed").length;
  const conversionPct = totalCount === 0 ? 0 : Math.round((placedCount / totalCount) * 100);

  const activeFilterCount = priorityFilters.size + ownerFilters.size;

  // ─── DnD handlers ───────────────────────────────────────────────────────────
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

  // ─── Render ─────────────────────────────────────────────────────────────────
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
            Move candidates through stages — from new profile to placement.
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
              <div
                role="menu"
                className="absolute right-0 top-full z-30 mt-1.5 w-[220px] overflow-hidden rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-dropdown)]"
              >
                {SORT_OPTIONS.map((opt) => {
                  const active = opt.key === sortKey;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setSortKey(opt.key);
                        setSortOpen(false);
                      }}
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
              <div
                role="menu"
                className="absolute right-0 top-full z-30 mt-1.5 w-[260px] overflow-hidden rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-dropdown)]"
              >
                <div className="border-b border-[color:var(--color-border)] p-3">
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-text-muted)]">
                    Priority
                  </p>
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
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-text-muted)]">
                    Owner
                  </p>
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
                          <span
                            className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white"
                            style={{ background: o.color }}
                          >
                            {o.initials}
                          </span>
                          <span className="flex-1 text-[12px] font-medium text-[color:var(--color-text)]">
                            {o.name}
                          </span>
                          {active ? <CheckIcon size={12} className="text-[color:var(--color-brand-500)]" /> : null}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between p-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPriorityFilters(new Set());
                      setOwnerFilters(new Set());
                    }}
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
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 shadow-[var(--shadow-card)]">
          <div className="flex items-start gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]" style={{ background: "#EEE9FF" }}>
              <UsersIcon size={16} style={{ color: "#5B3DF5" }} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-[color:var(--color-text-secondary)]">Total in Pipeline</p>
              <p className="mt-0.5 text-[22px] font-extrabold leading-none text-[color:var(--color-text)]">{totalCount}</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-1 text-[10px] font-semibold text-[color:var(--color-success)]">
            <TrendUpIcon size={11} /> 12%
            <span className="font-normal text-[color:var(--color-text-muted)]">vs last week</span>
          </div>
        </div>

        <div className="rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 shadow-[var(--shadow-card)]">
          <div className="flex items-start gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]" style={{ background: "#EAF2FF" }}>
              <TargetIcon size={16} style={{ color: "#3B82F6" }} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-[color:var(--color-text-secondary)]">Active Candidates</p>
              <p className="mt-0.5 text-[22px] font-extrabold leading-none text-[color:var(--color-text)]">{activeCount}</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-1 text-[10px] font-semibold text-[color:var(--color-info)]">
            <span className="font-normal text-[color:var(--color-text-muted)]">In motion right now</span>
          </div>
        </div>

        <div className="rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 shadow-[var(--shadow-card)]">
          <div className="flex items-start gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]" style={{ background: "#FDECEC" }}>
              <span aria-hidden className="text-[15px]">🔥</span>
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-[color:var(--color-text-secondary)]">High Priority</p>
              <p className="mt-0.5 text-[22px] font-extrabold leading-none text-[color:var(--color-text)]">{highPriorityCount}</p>
            </div>
          </div>
          <div className="mt-2.5 text-[10px] font-semibold text-[color:var(--color-error)]">
            <span className="font-normal text-[color:var(--color-text-muted)]">Need attention today</span>
          </div>
        </div>

        <div className="rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 shadow-[var(--shadow-card)]">
          <div className="flex items-start gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]" style={{ background: "#EAFBF1" }}>
              <span aria-hidden className="text-[15px]">🏆</span>
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-[color:var(--color-text-secondary)]">Placement Rate</p>
              <p className="mt-0.5 text-[22px] font-extrabold leading-none text-[color:var(--color-text)]">{conversionPct}%</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-1 text-[10px] font-semibold text-[color:var(--color-success)]">
            <TrendUpIcon size={11} /> 4%
            <span className="font-normal text-[color:var(--color-text-muted)]">conversion</span>
          </div>
        </div>
      </div>

      {/* Stage filter pills */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setFocus("all")}
          aria-pressed={focus === "all"}
          className={`flex shrink-0 items-center gap-2.5 rounded-full border px-3 py-2 text-left transition-all ${
            focus === "all"
              ? "border-transparent bg-[color:var(--color-surface)] shadow-[var(--shadow-card)]"
              : "border-[color:var(--color-border)] bg-[color:var(--color-surface)] hover:bg-[color:var(--color-surface-2)]"
          }`}
          style={focus === "all" ? { boxShadow: "0 0 0 1.5px var(--color-brand-500), var(--shadow-card)" } : undefined}
        >
          <span className="h-2 w-2 shrink-0 rounded-full bg-[color:var(--color-brand-500)]" />
          <span className={`text-[12px] font-semibold ${focus === "all" ? "text-[color:var(--color-text)]" : "text-[color:var(--color-text-secondary)]"}`}>
            All Stages
          </span>
          <span className="inline-flex h-5 min-w-[22px] items-center justify-center rounded-full bg-[color:var(--color-brand-100)] px-1.5 text-[11px] font-bold tabular-nums text-[color:var(--color-brand-600)]">
            {totalCount}
          </span>
        </button>
        {PIPELINE_STAGES.map((stage) => (
          <StageMetric
            key={stage.id}
            stage={stage}
            count={grouped[stage.id].length}
            active={focus === stage.id}
            onClick={() => setFocus(focus === stage.id ? "all" : stage.id)}
          />
        ))}
      </div>

      {/* Search + context row */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex h-9 flex-1 min-w-[220px] items-center rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 shadow-[var(--shadow-card)]">
          <SearchIcon size={14} className="text-[color:var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search candidates, roles, skills…"
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
        </div>

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
            <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[color:var(--color-surface)] bg-[color:var(--color-surface-2)] text-[10px] font-semibold text-[color:var(--color-text-secondary)]">
              +{pipelineOwners.length - 5}
            </span>
          </div>
        </div>
      </div>

      {/* Board */}
      {view === "board" ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-3 min-w-fit">
            {visibleStages.map((stage) => {
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
                  className={`flex w-[280px] shrink-0 flex-col rounded-[14px] p-1 transition-colors ${
                    isDropTarget
                      ? "bg-[color:var(--color-brand-50)] ring-2 ring-[color:var(--color-brand-300)] ring-offset-1 ring-offset-[color:var(--color-bg-base)]"
                      : ""
                  }`}
                >
                  <ColumnHeader
                    stage={stage}
                    count={stageCards.length}
                    onAdd={() => setAddingTo(addingTo === stage.id ? null : stage.id)}
                  />

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
                        className="group flex items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-[color:var(--color-border)] bg-transparent px-3 py-2 text-[11px] font-semibold text-[color:var(--color-text-muted)] transition-all hover:border-[color:var(--color-brand-300)] hover:bg-[color:var(--color-brand-50)] hover:text-[color:var(--color-brand-600)]"
                      >
                        <PlusIcon size={12} /> Add card
                      </button>
                    ) : null}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      ) : (
        // List view — compact table
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
                          <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                            style={{ background: c.avatarColor }}
                          >
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
                        <ScoreBar value={c.score} color={stage.color} />
                      </td>
                      <td className="px-3 py-3 text-[color:var(--color-text-secondary)]">{c.nextStep}</td>
                      <td className="px-3 py-3">
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                            style={{ background: c.owner.color }}
                          >
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

      {/* Footer tip */}
      <div className="mt-4 flex items-center gap-2 rounded-[10px] border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/40 px-3 py-2 text-[11px] text-[color:var(--color-text-muted)]">
        <SparklesIcon size={12} className="text-[color:var(--color-brand-500)]" />
        <span>
          <span className="font-semibold text-[color:var(--color-text-secondary)]">Tip:</span>{" "}
          Drag a card between columns to move a candidate, or click the ⋯ menu on any card. Click an owner avatar to filter by them.
        </span>
        <ChevronRight size={12} className="ml-auto text-[color:var(--color-text-muted)]" />
      </div>
    </div>
  );
}
